package ph61167.dunghn.duan.data.model;

import com.google.gson.annotations.SerializedName;

public class Product {

    @SerializedName("_id")
    private String id;
    private String name;
    private String description;
    private double price;
    private int stock;
    private String image;
    private Category category;

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public double getPrice() {
        return price;
    }

    public int getStock() {
        return stock;
    }

    public String getImage() {
        return image;
    }

    public Category getCategory() {
        return category;
    }

    public static class Category {
        @SerializedName("_id")
        private String id;
        private String name;

        public String getId() {
            return id;
        }

        public String getName() {
            return name;
        }
    }
}

