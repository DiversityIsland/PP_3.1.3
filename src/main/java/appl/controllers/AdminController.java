package appl.controllers;

import appl.config.DataInit;
import appl.models.CheckRole;
import appl.models.Role;
import appl.models.User;
import appl.models.Wrapper;
import appl.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Controller
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private UserService userService;

    @Autowired
    private DataInit init;

    @PostMapping()
    public String addUser(@ModelAttribute("user") User user,
                          @ModelAttribute("r_user") Boolean r_user,
                          @ModelAttribute("r_admin") Boolean r_admin) {
        if (r_user) {
            user.getRoles().add(init.R_USER);
        }
        if (r_admin) {
            user.getRoles().add(init.R_ADMIN);
        }

        userService.addUser(user);

        return "redirect:/admin";
    }

    @PutMapping("/{id}")
    public String updateUser(@ModelAttribute("wrapper") Wrapper wrapper,
                             @ModelAttribute("r_user_edit") String r_user,
                             @ModelAttribute("r_admin_edit") String r_admin,
                             @PathVariable("id") Long id) {
        User user = wrapper.getUsers().get(id.intValue() - 1);

        if (r_user.equals("r_user_edit")) {
            user.getRoles().add(init.R_USER);
        }
        if (r_admin.equals("r_admin_edit")) {
            user.getRoles().add(init.R_ADMIN);
        }

        userService.updateUser(id, user);

        return "redirect:/admin";
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable("id") Long id) {
        userService.deleteUser(id);

        return "redirect:/admin";
    }

    @GetMapping()
    public String getAllUsers(Model model) {
        Boolean r_user = null;
        Boolean r_admin = null;
        List<CheckRole> checkRoles = new ArrayList<>();
        List<User> users = userService.getAllUsers();
        Wrapper wrapper = new Wrapper(users);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        for (int i = 0; i < users.size(); i++) {
            r_user = users.get(i).getRoles().contains(init.R_USER);
            r_admin = users.get(i).getRoles().contains(init.R_ADMIN);
            checkRoles.add(new CheckRole(r_user, r_admin));
        }

        model.addAttribute("user", new User());
        model.addAttribute("checkRoles", checkRoles);
        model.addAttribute(("users"), users);
        model.addAttribute("wrapper", wrapper);
        model.addAttribute("a_user", (User) authentication.getPrincipal());

        return "admin/admin";
    }
}
