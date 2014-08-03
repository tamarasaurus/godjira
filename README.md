godjira
=======

Jira UI replacement  - add tasks, edit sprints, versions and view a dashboard


routes
=======

Query a person's issues, name can be nickname or jira username
http://localhost:3000/people/:name


View the issues for the active sprint grouped by person and ordered by status
http://localhost:3000/sprints/latest


instructions
=======

1. Install node
2. Clone from git https://github.com/tamarasaurus/godjira
3. Install dependencies ```npm install```
4. You need to make a config.js file and drop it into the godjira directory, it should look like this:

```javascript
    module.exports = {
        host: '',
        port: 'keep empty',
        user: '',
        password: '',
        //the main project in which the current sprint is active (currently necessary to specify becuse of the way that the jira rest api is structured
        project: {
            name: '',
            key: ''
        }
    };
```

5. Run ```npm update godjira```, then ```node index``` : ```http://localhost:3000```

roadmap
========

* ~~turn app into a sail.js project~~
* ~~implement user options db storage~~
* ~~add a settings page for users to choose the project from the hosted jira instance~~
* create controllers and actions for people, projects and sprints
* ~~remove node-jira as a dependency and write a new jira api wrapper~~
* design and develop ui for viewing a project and sprint dashboard
