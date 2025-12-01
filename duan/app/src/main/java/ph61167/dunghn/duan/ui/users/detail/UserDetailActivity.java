package ph61167.dunghn.duan.ui.users.detail;

import android.graphics.Color;
import android.os.Bundle;
import android.text.TextUtils;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import java.util.Locale;

import ph61167.dunghn.duan.databinding.ActivityUserDetailBinding;
import ph61167.dunghn.duan.data.remote.ApiClient;
import ph61167.dunghn.duan.data.remote.response.BaseResponse;
import ph61167.dunghn.duan.data.model.User;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class UserDetailActivity extends AppCompatActivity {

    private ActivityUserDetailBinding binding;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityUserDetailBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        binding.btnBack.setOnClickListener(v -> finish());

        String id = getIntent().getStringExtra("id");
        if (TextUtils.isEmpty(id)) {
            finish();
            return;
        }
        fetchDetail(id);
    }

    private void fetchDetail(String id) {
        ApiClient.getService().getUserDetail(id).enqueue(new Callback<BaseResponse<User>>() {
            @Override
            public void onResponse(Call<BaseResponse<User>> call, Response<BaseResponse<User>> response) {
                if (!response.isSuccessful() || response.body() == null) {
                    Toast.makeText(UserDetailActivity.this, "Không thể tải chi tiết", Toast.LENGTH_SHORT).show();
                    return;
                }
                BaseResponse<User> body = response.body();
                if (!body.isSuccess() || body.getData() == null) {
                    Toast.makeText(UserDetailActivity.this, body.getMessage(), Toast.LENGTH_SHORT).show();
                    return;
                }
                bind(body.getData());
            }

            @Override
            public void onFailure(Call<BaseResponse<User>> call, Throwable t) {
                Toast.makeText(UserDetailActivity.this, "Lỗi kết nối: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void bind(User user) {
        binding.chipId.setText("#" + safe(user.getId()));
        binding.tvName.setText("Tên: " + safe(user.getName()));
        binding.tvEmail.setText("Email: " + safe(user.getEmail()));
        binding.chipRole.setText(safe(user.getRole()));
        binding.chipRole.setChipBackgroundColor(android.content.res.ColorStateList.valueOf(getRoleColor(user.getRole())));
        binding.chipRole.setTextColor(Color.WHITE);
        binding.tvCreatedAt.setText("Ngày tạo: " + safe(user.getCreatedAt()));
        binding.tvUpdatedAt.setText("Cập nhật: " + safe(user.getUpdatedAt()));
    }

    private String safe(String s) {
        return TextUtils.isEmpty(s) ? "" : s;
    }

    private int getRoleColor(String role) {
        if (role == null) return Color.parseColor("#424242");
        String r = role.toLowerCase(Locale.ROOT);
        if (r.contains("admin")) return Color.parseColor("#9C27B0");
        if (r.contains("staff")) return Color.parseColor("#2196F3");
        return Color.parseColor("#424242");
    }
}
