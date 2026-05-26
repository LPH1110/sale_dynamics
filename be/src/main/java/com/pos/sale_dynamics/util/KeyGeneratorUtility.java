package com.pos.sale_dynamics.util;

import java.security.KeyPair;
import java.security.KeyPairGenerator;

public class KeyGeneratorUtility {
    public static KeyPair generateKeyPair() {
        KeyPair keypair;
        try {
            KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
            generator.initialize(2048);
            keypair = generator.generateKeyPair();
        } catch (Exception e) {
            throw new IllegalStateException();
        }
        return keypair;
    }
}
