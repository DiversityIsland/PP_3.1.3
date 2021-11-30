package appl.models;
import java.util.List;

public class Wrapper {
    private List<User> users;

    public Wrapper() {}

    public Wrapper(List<User> users) {
        this.users = users;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }
}
