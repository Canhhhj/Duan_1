package ph61167.dunghn.duan.data.remote.request;

public class RegisterRequest {
    private final String name;
    private final String email;
    private final String password;

    public RegisterRequest(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }
}

