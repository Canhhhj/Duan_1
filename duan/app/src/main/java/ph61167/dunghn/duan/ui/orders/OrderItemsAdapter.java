package ph61167.dunghn.duan.ui.orders;

import android.view.LayoutInflater;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import ph61167.dunghn.duan.data.model.OrderDetail;
import com.bumptech.glide.Glide;
import ph61167.dunghn.duan.databinding.ItemOrderDetailLineBinding;

public class OrderItemsAdapter extends RecyclerView.Adapter<OrderItemsAdapter.ItemViewHolder> {

    private final List<OrderDetail.Item> items = new ArrayList<>();
    private final NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));

    public void submitList(List<OrderDetail.Item> data) {
        items.clear();
        if (data != null) items.addAll(data);
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public ItemViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemOrderDetailLineBinding binding = ItemOrderDetailLineBinding.inflate(
                LayoutInflater.from(parent.getContext()), parent, false);
        return new ItemViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull ItemViewHolder holder, int position) {
        holder.bind(items.get(position), currencyFormat);
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    static class ItemViewHolder extends RecyclerView.ViewHolder {
        private final ItemOrderDetailLineBinding binding;

        ItemViewHolder(ItemOrderDetailLineBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        void bind(OrderDetail.Item item, NumberFormat fmt) {
            binding.tvName.setText(item.getProduct() != null ? item.getProduct().getName() : "");
            binding.tvUnitPrice.setText("Đơn giá: " + fmt.format(item.getPrice()));
            binding.tvQuantity.setText("Số lượng: " + item.getQuantity());
            String image = item.getProduct() != null ? item.getProduct().getImage() : null;
            Glide.with(binding.ivImage.getContext())
                    .load(image)
                    .placeholder(ph61167.dunghn.duan.R.drawable.img)
                    .error(ph61167.dunghn.duan.R.drawable.img)
                    .into(binding.ivImage);
            binding.getRoot().setOnClickListener(v -> {
                String name = item.getProduct() != null ? item.getProduct().getName() : "";
                android.content.Context ctx = v.getContext();
                android.content.Intent i = new android.content.Intent(ctx, ph61167.dunghn.duan.ui.product.ProductDetailActivity.class);
                i.putExtra("product_name", name);
                i.putExtra("product_price", item.getPrice());
                i.putExtra("product_description", "");
                i.putExtra("product_image", image);
                ctx.startActivity(i);
            });
        }
    }
}

