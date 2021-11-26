package appl.config;

import appl.models.Role;
import appl.models.User;
import appl.service.RoleService;
import appl.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Component
public class DataInit {
    public Role R_USER = new Role("ROLE_USER");
    public Role R_ADMIN = new Role("ROLE_ADMIN");

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @PostConstruct
    private void postConstruct() {
        User cj = new User("cj", "cj24",
                "Casey", "Jones", 24);
        User dj = new User("dj", "dj103",
                "Davy", "Jones", 103);
        User rh = new User("rh", "rh36",
                "Robin", "Hood", 36);
        User fk = new User("fk", "fk45",
                "Freddy", "Krueger", 45);

        roleService.addRole(R_USER);
        roleService.addRole(R_ADMIN);

        cj.getRoles().add(R_USER);
        //R_USER.getUsers().add(cj);

        dj.getRoles().add(R_ADMIN);
        //R_ADMIN.getUsers().add(dj);

        rh.getRoles().add(R_USER);
        //R_USER.getUsers().add(rh);

        fk.getRoles().add(R_ADMIN);
        //R_ADMIN.getUsers().add(fk);
        fk.getRoles().add(R_USER);
        //R_USER.getUsers().add(fk);

        userService.addUser(cj);
        userService.addUser(dj);
        userService.addUser(rh);
        userService.addUser(fk);
    }
}
