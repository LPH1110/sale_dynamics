package com.pos.sale_dynamics.service.CloudinaryService;

import com.pos.sale_dynamics.responses.CldUploadResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Map;
public interface CloudinaryService {
    CldUploadResponse upload(MultipartFile multipartFile) throws IOException;
    Map delete(String id) throws IOException;
    File convert(MultipartFile multipartFile) throws IOException;

}
