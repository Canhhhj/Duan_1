package ph61167.dunghn.duan.ui.users;

import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;

import java.util.List;

import ph61167.dunghn.duan.data.model.User;
import ph61167.dunghn.duan.data.remote.ApiClient;
import ph61167.dunghn.duan.data.remote.response.BaseResponse;
import ph61167.dunghn.duan.databinding.ActivityUsersBinding;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class UsersActivity extends AppCompatActivity {

    private ActivityUsersBinding binding;
    private UserAdapter userAdapter;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityUsersBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        setupHeader();
        setupRecyclerView();
        setupRefresh();
        fetchUsers();
    }

    private void setupHeader() {
        binding.btnBack.setOnClickListener(v -> finish());
    }

    private void setupRecyclerView() {
        userAdapter = new UserAdapter();
        binding.rvUsers.setLayoutManager(new LinearLayoutManager(this));
        binding.rvUsers.setAdapter(userAdapter);
    }

    private void setupRefresh() {
        binding.swipeRefresh.setOnRefreshListener(this::fetchUsers);
    }

    private void fetchUsers() {
        showLoading(true);
        ApiClient.getService().getUsersList().enqueue(new Callback<ph61167.dunghn.duan.data.remote.response.BaseResponse<ph61167.dunghn.duan.data.remote.response.UsersListData>>() {
            @Override
            public void onResponse(Call<ph61167.dunghn.duan.data.remote.response.BaseResponse<ph61167.dunghn.duan.data.remote.response.UsersListData>> call, Response<ph61167.dunghn.duan.data.remote.response.BaseResponse<ph61167.dunghn.duan.data.remote.response.UsersListData>> response) {
                showLoading(false);
                if (!response.isSuccessful() || response.body() == null) {
                    Toast.makeText(UsersActivity.this, "Không thể tải người dùng", Toast.LENGTH_SHORT).show();
                    return;
                }
                ph61167.dunghn.duan.data.remote.response.BaseResponse<ph61167.dunghn.duan.data.remote.response.UsersListData> body = response.body();
                if (body.isSuccess()) {
                    List<User> items = body.getData() != null ? body.getData().getItems() : null;
                    userAdapter.submitList(items);
                    boolean isEmpty = items == null || items.isEmpty();
                    binding.viewEmpty.setVisibility(isEmpty ? View.VISIBLE : View.GONE);
                    binding.rvUsers.setVisibility(isEmpty ? View.GONE : View.VISIBLE);
                } else {
                    Toast.makeText(UsersActivity.this, body.getMessage(), Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<ph61167.dunghn.duan.data.remote.response.BaseResponse<ph61167.dunghn.duan.data.remote.response.UsersListData>> call, Throwable t) {
                showLoading(false);
                Toast.makeText(UsersActivity.this, "Lỗi kết nối: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void showLoading(boolean isLoading) {
        binding.swipeRefresh.setRefreshing(isLoading);
    }
}
