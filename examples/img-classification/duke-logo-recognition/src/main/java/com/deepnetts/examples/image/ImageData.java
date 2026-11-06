package com.deepnetts.examples.image;

import deepnetts.data.ExampleImage;
import deepnetts.data.ImageSet;
import deepnetts.tensor.Tensor1D;
import deepnetts.util.ImageUtils;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import javax.imageio.ImageIO;

/**
 * Loads the images listed in an index file (one image path per line, optionally followed by its label).
 * Every image is resized, optionally converted to grayscale and inverted, and gets a one-hot target
 * built from labels.txt. An unreadable image stops loading with an error that names the file.
 * Unlike ImageSet.loadImages, it does not print every loaded path.
 */
public final class ImageData {
    private ImageData() {}

    public static ImageSet load(String directory, String indexName,
                                int width, int height,
                                boolean grayscale, boolean invert) throws Exception {
        Path root = Path.of(directory);
        String[] labels = Files.readAllLines(root.resolve("labels.txt")).stream()
                .map(String::trim).filter(s -> !s.isEmpty()).toArray(String[]::new);
        ImageSet images = new ImageSet(width, height);
        images.setColumnNames(labels);

        for (String line : Files.readAllLines(root.resolve(indexName))) {
            if (line.isBlank()) continue;
            String[] parts = line.trim().split("\\s+");
            Path file = root.resolve(parts[0]);
            String label = parts.length == 2 ? parts[1] : file.getParent().getFileName().toString();
            BufferedImage source = ImageIO.read(file.toFile());
            if (source == null) throw new IOException("Cannot read image: " + file);
            BufferedImage image = ImageUtils.scaleImage(source, width, height);
            if (grayscale) image = ImageUtils.grayscale(image);

            ExampleImage example = grayscale
                    ? new ExampleImage(image, label, 1)
                    : new ExampleImage(file.toFile(), image, label);
            float[] target = new float[labels.length];
            for (int i = 0; i < labels.length; i++)
                if (labels[i].equals(label)) target[i] = 1f;
            example.setTargetOutput(new Tensor1D(target));
            if (invert) example.invert();
            images.add(example);
        }
        return images;
    }
}
