package ph61167.dunghn.duan.data.remote.request;

import com.google.gson.annotations.SerializedName;

public class CartItemAddRequest {
    @SerializedName("userId")
    private final String userId;
    @SerializedName("productId")
    private final String productId;
    @SerializedName("soLuong")
    private final int quantity;

    public CartItemAddRequest(String userId, String productId, int quantity) {
        this.userId = userId;
        this.productId = productId;
        this.quantity = quantity;
    }
}

