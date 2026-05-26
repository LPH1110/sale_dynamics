package com.pos.sale_dynamics.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "thumbnails")
@NoArgsConstructor
public class Thumbnail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "thumbnail_id")
    private long id;
    private String url;

    @Column(name = "public_id")
    private String publicId;

    public Thumbnail(String url, String publicId) {
        this.url = url;
        this.publicId = publicId;
    }
}
