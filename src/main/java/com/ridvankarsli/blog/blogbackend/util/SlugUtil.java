package com.ridvankarsli.blog.blogbackend.util;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

public class SlugUtil {

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    public static String makeSlug(String input) {
        if (input == null) return "";

        input = input.replace("ı", "i").replace("İ", "I")
                .replace("ğ", "g").replace("Ğ", "G")
                .replace("ü", "u").replace("Ü", "U")
                .replace("ş", "s").replace("Ş", "S")
                .replace("ö", "o").replace("Ö", "O")
                .replace("ç", "c").replace("Ç", "C");

        String nowhitespace = WHITESPACE.matcher(input).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH).replaceAll("-{2,}", "-").replaceAll("^-|-$", "");
    }
}