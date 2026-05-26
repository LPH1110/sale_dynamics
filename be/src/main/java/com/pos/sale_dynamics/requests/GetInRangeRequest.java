package com.pos.sale_dynamics.requests;

public record GetInRangeRequest(String from, String to) {
    @Override
    public String from() {
        return from;
    }

    @Override
    public String to() {
        return to;
    }
}
