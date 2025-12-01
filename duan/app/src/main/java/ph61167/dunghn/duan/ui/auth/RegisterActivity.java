package ph61167.dunghn.duan.ui.auth;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Patterns;
import android.view.View;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import ph61167.dunghn.duan.data.local.SessionManager;
import ph61167.dunghn.duan.data.remote.ApiClient;
import ph61167.dunghn.duan.data.remote.request.RegisterRequest;
import ph61167.dunghn.duan.data.remote.response.AuthData;
import ph61167.dunghn.duan.data.remote.response.BaseResponse;
import ph61167.dunghn.duan.databinding.ActivityRegisterBinding;
import ph61167.dunghn.duan.ui.home.HomeActivity;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RegisterActivity extends AppCompatActivity {

    private ActivityRegisterBinding binding;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityRegisterBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        sessionManager = new SessionManager(this);

        binding.tvLogin.setOnClickListener(v -> {
            startActivity(new Intent(this, LoginActivity.class));
            finish();
        });

        binding.btnRegister.setOnClickListener(v -> attemptRegister());
    }

    private void attemptRegister() {
        String name = getText(binding.etUsername);
        String email = getText(binding.etEmail);
        String password = getText(binding.etPassword);
        String confirmPassword = getText(binding.etConfirmPassword);

        if (TextUtils.isEmpty(name)) {
            binding.etUsername.setError("Tên không được để trống");
            return;
        }

        if (TextUtils.isEmpty(email) || !Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            binding.etEmail.setError("Email không hợp lệ");
            return;
        }

        if (TextUtils.isEmpty(password) || password.length() < 6) {
            binding.etPassword.setError("Mật khẩu tối thiểu 6 ký tự");
            return;
        }

        if (!password.equals(confirmPassword)) {
            binding.etConfirmPassword.setError("Mật khẩu không khớp");
            return;
        }

        performRegister(name, email, password);
    }

    private void performRegister(String name, String email, String password) {
        showLoading(true);
        ApiClient.getService()
                .register(new RegisterRequest(name, email, password))
                .enqueue(new Callback<BaseResponse<AuthData>>() {
                    @Override
                    public void onResponse(
                            Call<BaseResponse<AuthData>> call,
                            Response<BaseResponse<AuthData>> response
                    ) {
                        showLoading(false);
                        if (!response.isSuccessful() || response.body() == null) {
                            Toast.makeText(RegisterActivity.this,
                                    "Không thể đăng ký. Vui lòng thử lại.",
                                    Toast.LENGTH_SHORT).show();
                            return;
                        }

                        BaseResponse<AuthData> body = response.body();
                        if (body.isSuccess() && body.getData() != null) {
                            sessionManager.saveSession(body.getData());
                            Toast.makeText(RegisterActivity.this,
                                    body.getMessage(),
                                    Toast.LENGTH_SHORT).show();
                            navigateToHome();
                        } else {
                            Toast.makeText(RegisterActivity.this,
                                    body.getMessage(),
                                    Toast.LENGTH_SHORT).show();
                        }
                    }

                    @Override
                    public void onFailure(Call<BaseResponse<AuthData>> call, Throwable t) {
                        showLoading(false);
                        Toast.makeText(RegisterActivity.this,
                                "Lỗi kết nối: " + t.getMessage(),
                                Toast.LENGTH_SHORT).show();
                    }
                });
    }

    private void showLoading(boolean isLoading) {
        binding.progressBar.setVisibility(isLoading ? View.VISIBLE : View.GONE);
        binding.btnRegister.setEnabled(!isLoading);
    }

    private String getText(android.widget.EditText editText) {
        return editText.getText() != null ? editText.getText().toString().trim() : "";
    }

    private void navigateToHome() {
        startActivity(new Intent(this, HomeActivity.class));
        finishAffinity();
    }
}

