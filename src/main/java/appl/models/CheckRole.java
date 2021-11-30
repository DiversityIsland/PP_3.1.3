package appl.models;

public class CheckRole {
    private Boolean r_user;
    private Boolean r_admin;

    public CheckRole() {}

    public CheckRole(boolean r_user, boolean r_admin) {
        this.r_user = r_user;
        this.r_admin = r_admin;
    }

    public boolean getR_user() {
        return r_user;
    }

    public boolean getR_admin() {
        return r_admin;
    }

    public void setR_user(boolean r_user) {
        this.r_user = r_user;
    }

    public void setR_admin(boolean r_admin) {
        this.r_admin = r_admin;
    }
}
