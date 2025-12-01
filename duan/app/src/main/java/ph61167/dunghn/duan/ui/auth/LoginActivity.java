package ph61167.dunghn.duan.ui.auth;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import ph61167.dunghn.duan.data.local.SessionManager;
import ph61167.dunghn.duan.data.remote.ApiClient;
import ph61167.dunghn.duan.data.remote.request.LoginRequest;
import ph61167.dunghn.duan.data.remote.response.AuthData;
import ph61167.dunghn.duan.data.remote.response.BaseResponse;
import ph61167.dunghn.duan.databinding.ActivityLoginBinding;
import ph61167.dunghn.duan.ui.home.HomeActivity;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginActivity extends AppCompatActivity {

    private ActivityLoginBinding binding;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityLoginBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        sessionManager = new SessionManager(this);

        if (sessionManager.isLoggedIn()) {
            navigateToHome();
            return;
        }

        binding.tvRegister.setOnClickListener(v ->
                startActivity(new Intent(this, RegisterActivity.class))
        );

        binding.btnLogin.setOnClickListener(v -> attemptLogin());
    }

    private void attemptLogin() {
        String email = binding.etAccount.getText() != null
                ? binding.etAccount.getText().toString().trim()
                : "";
        String password = binding.etPassword.getText() != null
                ? binding.etPassword.getText().toString().trim()
                : "";

        if (TextUtils.isEmpty(email)) {
            binding.etAccount.setError("Email không được để trống");
            return;
        }

        if (TextUtils.isEmpty(password)) {
            binding.etPassword.setError("Mật khẩu không được để trống");
            return;
        }

        performLogin(email, password);
    }

    private void performLogin(String email, String password) {
        showLoading(true);
        ApiClient.getService()
                .login(new LoginRequest(email, password))
                .enqueue(new Callback<BaseResponse<AuthData>>() {
                    @Override
                    public void onResponse(
                            Call<BaseResponse<AuthData>> call,
                            Response<BaseResponse<AuthData>> response
                    ) {
                        showLoading(false);
                        if (!response.isSuccessful() || response.body() == null) {
                            Toast.makeText(LoginActivity.this,
                                    "Không thể đăng nhập. Vui lòng thử lại.",
                                    Toast.LENGTH_SHORT).show();
                            return;
                        }

                        BaseResponse<AuthData> body = response.body();
                        if (body.isSuccess() && body.getData() != null) {
                            sessionManager.saveSession(body.getData());
                            Toast.makeText(LoginActivity.this,
                                    body.getMessage(),
                                    Toast.LENGTH_SHORT).show();
                            navigateToHome();
                        } else {
                            Toast.makeText(LoginActivity.this,
                                    body.getMessage(),
                                    Toast.LENGTH_SHORT).show();
                        }
                    }

                    @Override
                    public void onFailure(Call<BaseResponse<AuthData>> call, Throwable t) {
                        showLoading(false);
                        Toast.makeText(LoginActivity.this,
                                "Lỗi kết nối: " + t.getMessage(),
                                Toast.LENGTH_SHORT).show();
                    }
                });
    }

    private void showLoading(boolean isLoading) {
        binding.progressBar.setVisibility(isLoading ? View.VISIBLE : View.GONE);
        binding.btnLogin.setEnabled(!isLoading);
    }

    private void navigateToHome() {
        startActivity(new Intent(this, HomeActivity.class));
        finish();
    }
}

