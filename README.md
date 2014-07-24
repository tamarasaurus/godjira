godjira
=======

Jira UI replacement  - add tasks, edit sprints, versions and view a dashboard


instructions
=======

1. Install node
2. Clone from git https://github.com/tamarasaurus/godjira
3. Install dependencies ```npm install```
4. You need to make a config.js file and drop it into the godjira directory, it should look like this:

```javascript
    module.exports = {
        host: 'YOUR_HOST_NAME',
        port: 'YOUR_PORT',
        user: 'YOUR_JIRA_USERNAME',
        password: 'YOUR_JIRA_PASSWORD'
    };

```

5. Run ```node index``` : ```http://localhost:3000```