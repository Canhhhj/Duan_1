package ph61167.dunghn.duan.data.model;

import com.google.gson.annotations.SerializedName;

public class User {
    @SerializedName(value = "_id", alternate = {"id"})
    private String id;
    private String name;
    private String email;
    private String role;
    private String createdAt;
    private String updatedAt;

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }
}

