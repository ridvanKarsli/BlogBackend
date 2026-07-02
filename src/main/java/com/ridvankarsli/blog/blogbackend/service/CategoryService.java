package com.ridvankarsli.blog.blogbackend.service;

import com.ridvankarsli.blog.blogbackend.dto.CategoryRequest;
import com.ridvankarsli.blog.blogbackend.entity.Category;
import com.ridvankarsli.blog.blogbackend.repository.CategoryRepository;
import com.ridvankarsli.blog.blogbackend.util.SlugUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public Category createCategory(CategoryRequest request) {
        Category category = new Category();
        category.setName(request.getName());
        category.setSlug(SlugUtil.makeSlug(request.getName()));
        return categoryRepository.save(category);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryBySlug(String slug) {
        return categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Kategori bulunamadı!"));
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Kategori bulunamadı!"));
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    public Category updateCategory(Long id, com.ridvankarsli.blog.blogbackend.dto.CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Güncellenecek kategori bulunamadı!"));
        category.setName(request.getName());
        category.setSlug(com.ridvankarsli.blog.blogbackend.util.SlugUtil.makeSlug(request.getName()));
        return categoryRepository.save(category);
    }
}