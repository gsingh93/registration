Registration
============

Registration website, used for the Sikh Society of Michigan Punjabi class registration and Sikh youth camp registration.

Building
--------

### Front end

Requires `bower`, `jade`, `typescript`, `less`, `cleancss`, and `csslint` for frontend dev.

```
bower install
cd script && tsd install
make
```

The resulting site will be built and put in `public`. To build in release mode, run `make RELEASE=1`.

`make test` will run any tests in the `tests` folder. Selenium is required for testing.

### Backend

The Parse command line tool is required for backend dev. Relevant code is stored in `parse`.

A file called `secret.py` must be created to use any scripts requiring login. The contents of the script must be as follows:

```
username = 'username_here'
password = 'password_here'
```

Changes to the Parse code can be deployed with `parse deploy`. However, any sensitive data not included in the repository must be substituted in the corresponding files first. `cd` into the `config` folder and create a file called `masterkey.txt` containing the projects master key (and nothing else). Similarly, `cd` into the `cloud` folder and add a file called `sendgrid_password.txt` containing your SendGrid password. Then run `./unsanitize.sh` which will insert these sensitive pieces of data into the correct files.
