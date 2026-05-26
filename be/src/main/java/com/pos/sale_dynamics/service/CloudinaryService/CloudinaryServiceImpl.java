package com.pos.sale_dynamics.service.CloudinaryService;

import com.cloudinary.utils.ObjectUtils;
import com.pos.sale_dynamics.dto.CropRatioDTO;
import com.pos.sale_dynamics.responses.CldUploadResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Map;
import java.util.Objects;

import com.cloudinary.*;

@Service
@RequiredArgsConstructor
public class CloudinaryServiceImpl implements CloudinaryService {

    @Autowired
    private final Cloudinary cloudinary;

    @Override
    public CldUploadResponse upload(MultipartFile multipartFile) throws IOException {
        File file = convert(multipartFile);
        Map result = cloudinary.uploader().upload(file, ObjectUtils.emptyMap());
        if (!Files.deleteIfExists(file.toPath())) {
            throw new IOException("Failed to delete temporary file: " + file.getAbsolutePath());
        }
        return new CldUploadResponse(result.get("public_id").toString(), result.get("url").toString());
    }

    @Override
    public Map delete(String id) throws IOException {
        return cloudinary.uploader().destroy(id, ObjectUtils.emptyMap());
    }

    @Override
    public File convert(MultipartFile multipartFile) throws IOException {
        File file = new File(Objects.requireNonNull(multipartFile.getOriginalFilename()));
        FileOutputStream fo = new FileOutputStream(file);
        fo.write(multipartFile.getBytes());
        fo.close();
        return file;
    }

    private BufferedImage cropImageSquare(BufferedImage image, CropRatioDTO crop) {
        int height = image.getHeight();
        int width = image.getWidth();

        // Compute the size of the square
        int squareSize = Math.min(height, width);

        // Coordinates of the image's middle
        int xc = width / 2;
        int yc = height / 2;

        // Crop
        return image.getSubimage(
                xc - (squareSize / 2), // x coordinate of the upper-left corner
                yc - (squareSize / 2), // y coordinate of the upper-left corner
                squareSize, // width
                squareSize  // height
        );
    }
}
