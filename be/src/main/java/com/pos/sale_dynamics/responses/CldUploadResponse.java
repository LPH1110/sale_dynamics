package com.pos.sale_dynamics.responses;

public record CldUploadResponse(
        String public_id,
        String url
) {
    @Override
    public String public_id() {
        return public_id;
    }

    @Override
    public String url() {
        return url;
    }

}
