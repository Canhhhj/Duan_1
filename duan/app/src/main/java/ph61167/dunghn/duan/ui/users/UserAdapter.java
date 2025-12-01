package ph61167.dunghn.duan.ui.users;

import android.content.Context;
import android.content.Intent;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import ph61167.dunghn.duan.data.model.User;
import ph61167.dunghn.duan.databinding.ItemUserBinding;
import ph61167.dunghn.duan.ui.users.detail.UserDetailActivity;

public class UserAdapter extends RecyclerView.Adapter<UserAdapter.UserViewHolder> {

    private final List<User> users = new ArrayList<>();

    public void submitList(List<User> data) {
        users.clear();
        if (data != null) {
            users.addAll(data);
        }
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public UserViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemUserBinding binding = ItemUserBinding.inflate(
                LayoutInflater.from(parent.getContext()),
                parent,
                false
        );
        return new UserViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull UserViewHolder holder, int position) {
        holder.bind(users.get(position));
    }

    @Override
    public int getItemCount() {
        return users.size();
    }

    static class UserViewHolder extends RecyclerView.ViewHolder {

        private final ItemUserBinding binding;

        UserViewHolder(ItemUserBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        void bind(User user) {
            String nameOrId = user.getName() != null && !user.getName().isEmpty() ? user.getName() : user.getId();
            binding.tvNameOrId.setText(nameOrId);
            binding.tvEmail.setText(user.getEmail());

            binding.chipRole.setText(user.getRole());
            int roleColor = getRoleColor(user.getRole());
            binding.chipRole.setChipBackgroundColor(ColorStateList.valueOf(roleColor));
            binding.chipRole.setTextColor(Color.WHITE);

            String created = user.getCreatedAt();
            String dateOnly = created != null && created.contains("T") ? created.substring(0, created.indexOf('T')) : created;
            binding.tvCreatedDate.setText("Ngày đăng ký: " + (dateOnly != null ? dateOnly : ""));

            binding.btnDetail.setOnClickListener(v -> openDetail(v.getContext(), user));
        }

        private int getRoleColor(String role) {
            if (role == null) return Color.parseColor("#424242");
            String r = role.toLowerCase(Locale.ROOT);
            if (r.contains("admin")) return Color.parseColor("#9C27B0");
            if (r.contains("staff")) return Color.parseColor("#2196F3");
            return Color.parseColor("#424242");
        }

        private void openDetail(Context context, User user) {
            Intent intent = new Intent(context, UserDetailActivity.class);
            intent.putExtra("id", user.getId());
            context.startActivity(intent);
        }
    }
}
