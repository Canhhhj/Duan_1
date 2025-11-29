package ph61167.dunghn.duan.data.model;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class CartData {
    @SerializedName("id")
    private String id;
    @SerializedName("idKH")
    private String userId;
    @SerializedName("tongGia")
    private double totalAmount;
    @SerializedName("ngayTao")
    private String createdAt;
    @SerializedName("ngayCapNhat")
    private String updatedAt;
    @SerializedName("items")
    private List<Item> items;

    public String getId() { return id; }
    public String getUserId() { return userId; }
    public double getTotalAmount() { return totalAmount; }
    public String getCreatedAt() { return createdAt; }
    public String getUpdatedAt() { return updatedAt; }
    public List<Item> getItems() { return items; }

    public static class Item {
        @SerializedName("id")
        private String id;
        private ProductInfo product;
        @SerializedName("donGia")
        private double unitPrice;
        @SerializedName("thanhTien")
        private double lineTotal;
        @SerializedName("soLuong")
        private int quantity;

        public String getId() { return id; }
        public ProductInfo getProduct() { return product; }
        public double getUnitPrice() { return unitPrice; }
        public double getLineTotal() { return lineTotal; }
        public int getQuantity() { return quantity; }
    }

    public static class ProductInfo {
        private String image;
        private String name;
        @SerializedName("_id")
        private String id;

        public String getImage() { return image; }
        public String getName() { return name; }
        public String getId() { return id; }
    }
}
