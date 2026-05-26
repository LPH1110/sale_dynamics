package com.pos.sale_dynamics.dto;

public record CropRatioDTO(double x, double y, double width, double height) {
    @Override
    public double x() {
        return x;
    }

    @Override
    public double y() {
        return y;
    }

    @Override
    public double width() {
        return width;
    }

    @Override
    public double height() {
        return height;
    }
}
