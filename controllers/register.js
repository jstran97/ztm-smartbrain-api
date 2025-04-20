const handleRegister = (request, response, db, bcrypt) => {
    const { name, email, password } = request.body;
    // If any of these are empty
    if (!email || !name || !password) {
        return response.status(400).json('Incorrect form submission');
    }

    const hash = bcrypt.hashSync(password);

    db
        .transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0].email,
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        console.log('MADE IT TO /register .then(user=>)')
                        console.log(`user[0]: ${user[0]}`);

                        response.json(user[0]);
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => response.status(400).json('Unable to register'))
}

export default handleRegister;