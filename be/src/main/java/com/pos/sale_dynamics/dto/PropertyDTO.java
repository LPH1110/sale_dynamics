package com.pos.sale_dynamics.dto;

import java.util.List;

public record PropertyDTO(
        String name,
        List<String> tags
) {
    public String name() { return name;}
    public List<String> tags() { return tags;}
}
