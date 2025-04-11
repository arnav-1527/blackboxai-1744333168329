const users = [
    { username: 'admin', password: 'admin123' },
    { username: 'user', password: 'user123' }
];

function authenticate(username, password) {
    const user = users.find(user => user.username === username && user.password === password);
    return user !== undefined;
}
