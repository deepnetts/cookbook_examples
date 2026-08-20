package com.deepnetts.examples.tensorflowvggnet;

import deepnetts.data.ExampleImage;
import deepnetts.tensor.Tensor3D;
import deepnetts.util.ImageUtils;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.awt.image.Raster;
import java.io.IOException;
import java.nio.file.Path;

/** Converts an image to the BGR, ImageNet-centered layout used by VGGNet16. */
final class VggNet16InputImage extends ExampleImage {

    private static final int SIZE = 224;

    VggNet16InputImage(Path imagePath) throws IOException {
        this(readImage(imagePath));
    }

    private VggNet16InputImage(BufferedImage image) {
        super(ImageUtils.scaleImage(image, SIZE, SIZE));
    }

    private static BufferedImage readImage(Path imagePath) throws IOException {
        BufferedImage image = ImageIO.read(imagePath.toFile());
        if (image == null) {
            throw new IOException("Cannot read image: " + imagePath);
        }
        return image;
    }

    @Override
    protected void createInputFromPixels(BufferedImage image, int channels) {
        float[] imageNetMean = {103.939f, 116.779f, 123.68f};
        int width = image.getWidth();
        int height = image.getHeight();
        float[] bgr = new float[height * width * channels];

        if (image.getType() != BufferedImage.TYPE_INT_ARGB) {
            BufferedImage copy = new BufferedImage(
                    width, height, BufferedImage.TYPE_INT_ARGB);
            copy.getGraphics().drawImage(image, 0, 0, null);
            image = copy;
        }

        Raster raster = image.getRaster();
        float[] pixel = null;
        int planeSize = width * height;
        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                pixel = raster.getPixel(x, y, pixel);
                int index = x * height + y;
                bgr[index] = pixel[2] - imageNetMean[0];
                bgr[planeSize + index] = pixel[1] - imageNetMean[1];
                bgr[2 * planeSize + index] = pixel[0] - imageNetMean[2];
            }
        }
        rgbTensor = new Tensor3D(channels, height, width, bgr);
    }
}
