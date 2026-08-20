package com.deepnetts.examples.tensorflowvggnet;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.AtomicMoveNotSupportedException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.Duration;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

/** Downloads and safely extracts the original TensorFlow VGGNet16 weights. */
final class VggWeightsDownloader {

    private static final URI WEIGHTS_URI = URI.create(
            "https://www.dropbox.com/s/62pr7xyrx2vvpyn/"
                    + "vgg16_imagenet_weights.zip?dl=1");
    private static final String WEIGHTS_FILE =
            "vgg16_imagenet_weights.txt";
    private static final String ARCHIVE_FILE =
            "vgg16_imagenet_weights.zip";

    private VggWeightsDownloader() {
    }

    static Path obtain(Path cacheDirectory) throws IOException, InterruptedException {
        Files.createDirectories(cacheDirectory);
        Path weights = cacheDirectory.resolve(WEIGHTS_FILE);
        if (Files.isRegularFile(weights) && Files.size(weights) > 0) {
            System.out.println("Using cached weights: " + weights);
            return weights;
        }

        Path archive = cacheDirectory.resolve(ARCHIVE_FILE);
        if (!Files.isRegularFile(archive) || Files.size(archive) == 0) {
            download(archive);
        }
        extractSafely(archive, cacheDirectory);

        if (!Files.isRegularFile(weights) || Files.size(weights) == 0) {
            throw new IOException("Archive did not contain " + WEIGHTS_FILE);
        }
        return weights;
    }

    private static void download(Path archive)
            throws IOException, InterruptedException {
        Path temporary = archive.resolveSibling(archive.getFileName() + ".part");
        Files.deleteIfExists(temporary);
        System.out.println("Downloading TensorFlow VGGNet16 weights (~600 MB)...");
        HttpClient client = HttpClient.newBuilder()
                .followRedirects(HttpClient.Redirect.NORMAL)
                .connectTimeout(Duration.ofSeconds(30))
                .build();
        HttpRequest request = HttpRequest.newBuilder(WEIGHTS_URI)
                .timeout(Duration.ofMinutes(30))
                .GET()
                .build();
        try {
            HttpResponse<Path> response = client.send(
                    request, HttpResponse.BodyHandlers.ofFile(temporary));
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new IOException(
                        "Weights download failed with HTTP " + response.statusCode());
            }
            try {
                Files.move(temporary, archive,
                        StandardCopyOption.ATOMIC_MOVE,
                        StandardCopyOption.REPLACE_EXISTING);
            } catch (AtomicMoveNotSupportedException exception) {
                Files.move(temporary, archive,
                        StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException | InterruptedException exception) {
            Files.deleteIfExists(temporary);
            throw exception;
        }
    }

    private static void extractSafely(Path archive, Path destination)
            throws IOException {
        Path normalizedDestination = destination.toAbsolutePath().normalize();
        try (InputStream input = Files.newInputStream(archive);
             ZipInputStream zip = new ZipInputStream(input)) {
            ZipEntry entry;
            while ((entry = zip.getNextEntry()) != null) {
                Path output = normalizedDestination.resolve(entry.getName()).normalize();
                if (!output.startsWith(normalizedDestination)) {
                    throw new IOException("Unsafe ZIP entry: " + entry.getName());
                }
                if (entry.isDirectory()) {
                    Files.createDirectories(output);
                } else {
                    Files.createDirectories(output.getParent());
                    Files.copy(zip, output, StandardCopyOption.REPLACE_EXISTING);
                }
                zip.closeEntry();
            }
        }
    }
}
