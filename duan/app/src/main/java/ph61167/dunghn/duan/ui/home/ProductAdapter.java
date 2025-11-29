package ph61167.dunghn.duan.ui.home;

import android.view.LayoutInflater;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import ph61167.dunghn.duan.data.model.Product;
import com.bumptech.glide.Glide;
import ph61167.dunghn.duan.databinding.ItemProductBinding;

public class ProductAdapter extends RecyclerView.Adapter<ProductAdapter.ProductViewHolder> {

    private final List<Product> products = new ArrayList<>();
    private final NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));

    public void submitList(List<Product> data) {
        products.clear();
        if (data != null) {
            products.addAll(data);
        }
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public ProductViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemProductBinding binding = ItemProductBinding.inflate(
                LayoutInflater.from(parent.getContext()),
                parent,
                false
        );
        return new ProductViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull ProductViewHolder holder, int position) {
        holder.bind(products.get(position), currencyFormat);
    }

    @Override
    public int getItemCount() {
        return products.size();
    }

    static class ProductViewHolder extends RecyclerView.ViewHolder {

        private final ItemProductBinding binding;

        ProductViewHolder(ItemProductBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        void bind(Product product, NumberFormat format) {
            binding.tvProductName.setText(product.getName());
            binding.tvProductPrice.setText(format.format(product.getPrice()));
            Glide.with(binding.ivProduct.getContext())
                    .load(product.getImage())
                    .placeholder(ph61167.dunghn.duan.R.drawable.img)
                    .error(ph61167.dunghn.duan.R.drawable.img)
                    .into(binding.ivProduct);
            binding.getRoot().setOnClickListener(v -> {
                android.content.Context ctx = v.getContext();
                android.content.Intent i = new android.content.Intent(ctx, ph61167.dunghn.duan.ui.product.ProductDetailActivity.class);
                i.putExtra("product_id", product.getId());
                i.putExtra("product_name", product.getName());
                i.putExtra("product_description", product.getDescription());
                i.putExtra("product_price", product.getPrice());
                i.putExtra("product_image", product.getImage());
                ctx.startActivity(i);
            });
        }
    }
}

