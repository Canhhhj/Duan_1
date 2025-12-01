package ph61167.dunghn.duan.ui.product;

import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import java.text.NumberFormat;
import java.util.Locale;

import ph61167.dunghn.duan.databinding.ActivityProductDetailBinding;
import com.bumptech.glide.Glide;
import ph61167.dunghn.duan.data.local.SessionManager;
import ph61167.dunghn.duan.data.remote.ApiClient;
import ph61167.dunghn.duan.data.remote.request.CartItemAddRequest;
import ph61167.dunghn.duan.data.remote.response.BaseResponse;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ProductDetailActivity extends AppCompatActivity {

    private ActivityProductDetailBinding binding;
    private final NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
    private SessionManager sessionManager;
    private String productId;
    private int quantity = 1;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityProductDetailBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        binding.btnBack.setOnClickListener(v -> finish());
        sessionManager = new SessionManager(this);

        productId = getIntent().getStringExtra("product_id");
        String name = getIntent().getStringExtra("product_name");
        String desc = getIntent().getStringExtra("product_description");
        double price = getIntent().getDoubleExtra("product_price", 0);
        String image = getIntent().getStringExtra("product_image");

        if (!TextUtils.isEmpty(name)) binding.tvProductName.setText(name);
        if (!TextUtils.isEmpty(desc)) binding.tvProductDescription.setText(desc);
        binding.tvProductPrice.setText(currencyFormat.format(price));
        Glide.with(binding.ivProduct.getContext())
                .load(image)
                .placeholder(ph61167.dunghn.duan.R.drawable.img)
                .error(ph61167.dunghn.duan.R.drawable.img)
                .into(binding.ivProduct);

        binding.btnDecrease.setOnClickListener(v -> changeQuantity(-1));
        binding.btnIncrease.setOnClickListener(v -> changeQuantity(1));
        binding.btnAddToCart.setOnClickListener(v -> addToCart());
    }

    private void changeQuantity(int delta) {
        int current = parseInt(binding.tvQuantity.getText().toString(), quantity);
        quantity = Math.max(1, current + delta);
        binding.tvQuantity.setText(String.valueOf(quantity));
    }

    private int parseInt(String s, int def) {
        try { return Integer.parseInt(s.trim()); } catch (Exception e) { return def; }
    }

    private void setLoading(boolean loading) {
        binding.btnAddToCart.setEnabled(!loading);
        binding.btnAddToCart.setText(loading ? "Đang thêm..." : "Add to cart");
    }

    private void addToCart() {
        String userId = sessionManager.getUserId();
        if (TextUtils.isEmpty(userId) || TextUtils.isEmpty(productId)) {
            Toast.makeText(this, "Thiếu thông tin người dùng hoặc sản phẩm", Toast.LENGTH_SHORT).show();
            return;
        }
        setLoading(true);
        CartItemAddRequest req = new CartItemAddRequest(userId, productId, quantity);
        ApiClient.getService().addCartItem(req).enqueue(new Callback<BaseResponse<Object>>() {
            @Override
            public void onResponse(Call<BaseResponse<Object>> call, Response<BaseResponse<Object>> response) {
                setLoading(false);
                if (!response.isSuccessful() || response.body() == null) {
                    Toast.makeText(ProductDetailActivity.this, "Không thể thêm vào giỏ hàng", Toast.LENGTH_SHORT).show();
                    return;
                }
                BaseResponse<Object> body = response.body();
                if (body.isSuccess()) {
                    Toast.makeText(ProductDetailActivity.this, body.getMessage(), Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(ProductDetailActivity.this, body.getMessage(), Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<BaseResponse<Object>> call, Throwable t) {
                setLoading(false);
                Toast.makeText(ProductDetailActivity.this, "Lỗi kết nối: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }
}
