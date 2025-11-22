package ph61167.dunghn.duan.data.remote.response;

import ph61167.dunghn.duan.data.model.User;

public class AuthData {
    private String token;
    private User user;

    public String getToken() {
        return token;
    }

    public User getUser() {
        return user;
    }
}

