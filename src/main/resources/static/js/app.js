$(async function () {
    await getTableWithUsers();
    await getDefaultModal();
    await addNewUser();
})

const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    //getRole: async (id) => await fetch(`rest/roles/${id}`),
    getAllUsers: async () => await fetch('rest/users'),
    getUser: async (id) => await fetch(`rest/users/${id}`),
    addUser: async (user) => await fetch('rest/users', {method: 'POST', headers: userFetchService.head, body: JSON.stringify(user)}),
    updateUser: async (user, id) => await fetch(`rest/users/${id}`, {method: 'PUT', headers: userFetchService.head, body: JSON.stringify(user)}),
    deleteUser: async (id) => await fetch(`rest/users/${id}`, {method: 'DELETE', headers: userFetchService.head})
}

async function getTableWithUsers() {
    let table = $('#mainTableWithUsers tbody');
    table.empty();

    await userFetchService.getAllUsers()
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                let tableFilling = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.name}</td>
                            <td>${user.surname}</td>
                            <td>${user.age}</td>    
                            <td>${user.username}</td>
                            <td>${user.stringRoles}</td>
                            <td>
                                <button type="button" data-userid="${user.id}" data-action="edit" class="btn btn-sm btn-primary" 
                                data-toggle="modal" data-target="#someDefaultModal">Edit</button>
                            </td>
                            <td>
                                <button type="button" data-userid="${user.id}" data-action="delete" class="btn btn-sm btn-danger" 
                                data-toggle="modal" data-target="#someDefaultModal">Delete</button>
                            </td>
                        </tr>
                )`;
                table.append(tableFilling);
            })
        })

    $("#mainTableWithUsers").find('button').on('click', (event) => {
        let defaultModal = $('#someDefaultModal');

        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');

        defaultModal.attr('data-userid', buttonUserId);
        defaultModal.attr('data-action', buttonAction);
        defaultModal.modal('show');
    })
}

async function getDefaultModal() {
    $('#someDefaultModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');
        switch (action) {
            case 'edit':
                editUser(thisModal, userid);
                break;
            case 'delete':
                deleteUser(thisModal, userid);
                break;
        }
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}

async function editUser(modal, id) {
    let preuser = await userFetchService.getUser(id);
    let user = preuser.json();

    modal.find('.modal-title').html('Edit user');

    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`;
    let editButton = `<button  class="btn btn-primary" id="editButton">Edit</button>`;
    modal.find('.modal-footer').append(closeButton);
    modal.find('.modal-footer').append(editButton);

    user.then(user => {
        let bodyForm = `
            <form class="form-group" id="editUser">
                <label for="id">ID</label>
                <input class="form-control" type="text" id="id" name="id" value="${user.id}" disabled><br>
                <label for="name">Name</label>
                <input class="form-control" type="text" id="name" value="${user.name}"><br>
                <label for="surname">Surname</label>
                <input class="form-control" type="text" id="surname" value="${user.surname}"><br>
                <label for="age">Age</label>
                <input class="form-control" type="number" id="age" value="${user.age}"><br>
                <label for="username">Username</label>
                <input class="form-control" type="text" id="username" value="${user.username}"><br>
                <label for="password">Password</label>
                <input class="form-control" type="password" id="password">
            </form>
        `;
        modal.find('.modal-body').append(bodyForm);
        let userCheck = "";
        let adminCheck = "";
        if (user.userFlag) {
            userCheck = 'checked';
        }
        if (user.adminFlag) {
            adminCheck = 'checked';
        }
        let flags = `
            <label for="ROLE_USER">USER</label>
            <input type="checkbox" name="ROLE_USER" id="ROLE_USER_edit" value="ROLE_USER" ${userCheck}><br/>                                       
            <label for="ROLE_ADMIN">ADMIN</label>
            <input type="checkbox" name="ROLE_ADMIN" id="ROLE_ADMIN_edit" value="ROLE_ADMIN" ${adminCheck}><br/> 
        `;
        modal.find('.modal-body').append(flags);
    })

    $("#editButton").on('click', async () => {
        let id = modal.find("#id").val().trim();
        let name = modal.find("#name").val().trim();
        let surname = modal.find("#surname").val().trim();
        let age = modal.find("#age").val().trim();
        let username = modal.find("#username").val().trim();
        let password = modal.find("#password").val().trim();
        let userCheck = document.getElementById("ROLE_USER_edit");
        let adminCheck = document.getElementById("ROLE_ADMIN_edit");
        let checks = [];
        if (userCheck.checked) {
            let role1 = new Object();
            role1.id = 1;
            role1.role = userCheck.value;
            checks.push(role1);
        }
        if (adminCheck.checked) {
            let role2 = new Object();
            role2.id = 2;
            role2.role = adminCheck.value;
            checks.push(role2);
        }
        let data = {
            id: id,
            name: name,
            surname: surname,
            age: age,
            username: username,
            password: password,
            roles: checks
        }
        const response = await userFetchService.updateUser(data, id);

        if (response.ok) {
            getTableWithUsers();
            modal.modal('hide');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            modal.find('.modal-body').prepend(alert);
        }
    })
}

async function deleteUser(modal, id) {
    let preuser = await userFetchService.getUser(id);
    let user = preuser.json();

    modal.find('.modal-title').html('Delete user');

    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`;
    let deleteButton = `<button  class="btn btn-danger" id="deleteButton" onclick="this.style.display='none'">Delete</button>`;
    modal.find('.modal-footer').append(closeButton);
    modal.find('.modal-footer').append(deleteButton);

    user.then(user => {
        let bodyForm = `
            <form class="form-group" id="deleteUser">
                <label for="id">ID</label>
                <input class="form-control" type="text" id="id" name="id" value="${user.id}" disabled><br>
                <label for="name">Name</label>
                <input class="form-control" type="text" id="name" value="${user.name}" disabled><br>
                <label for="surname">Surname</label>
                <input class="form-control" type="text" id="surname" value="${user.surname}" disabled><br>
                <label for="age">Age</label>
                <input class="form-control" type="number" id="age" value="${user.age}" disabled><br>
                <label for="username">Username</label>
                <input class="form-control" type="text" id="username" value="${user.username}" disabled><br>
            </form>
        `;
        modal.find('.modal-body').append(bodyForm);
        let userCheck = "";
        let adminCheck = "";
        if (user.userFlag) {
            userCheck = 'checked';
        }
        if (user.adminFlag) {
            adminCheck = 'checked';
        }
        let flags = `
            <label for="ROLE_USER">USER</label>
            <input type="checkbox" name="ROLE_USER" id="ROLE_USER" value=1 ${userCheck} disabled><br/>                                       
            <label for="ROLE_ADMIN">ADMIN</label>
            <input type="checkbox" name="ROLE_ADMIN" id="ROLE_ADMIN" value=2 ${adminCheck} disabled><br/> 
        `;
        modal.find('.modal-body').append(flags);
    })

    $("#deleteButton").on('click', async () => {
        await userFetchService.deleteUser(id);
        getTableWithUsers();
        modal.find('.modal-title').html('');
        modal.find('.modal-body').html('User was deleted');
    })
}

async function addNewUser() {
    $('#addNewUserButton').click(async () =>  {
        let addUserForm = $('#defaultSomeForm')
        let name = addUserForm.find('#name').val();
        let surname = addUserForm.find('#surname').val();
        let age = addUserForm.find('#age').val().trim();
        let username = addUserForm.find('#username').val().trim();
        let password = addUserForm.find('#password').val().trim();
        let userCheck = document.getElementById("ROLE_USER");
        let adminCheck = document.getElementById("ROLE_ADMIN");
        let checks = [];
        if (userCheck.checked) {
            let role1 = new Object();
            role1.id = 1;
            role1.role = userCheck.value;
            checks.push(role1);
        }
        if (adminCheck.checked) {
            let role2 = new Object();
            role2.id = 2;
            role2.role = adminCheck.value;
            checks.push(role2);
        }
        let data = {
            name: name,
            surname: surname,
            age: age,
            username: username,
            password: password,
            roles: checks
        }
        const response = await userFetchService.addUser(data);
        if (response.ok) {
            getTableWithUsers();
            document.getElementById("mainTabButton").click();
            addUserForm.find('#name').val('');
            addUserForm.find('#surname').val('');
            addUserForm.find('#age').val('');
            addUserForm.find('#username').val('');
            addUserForm.find('#password').val('');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            addUserForm.prepend(alert)
        }
    })
}