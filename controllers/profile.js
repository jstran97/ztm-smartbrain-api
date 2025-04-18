const handleProfileGet = (request, response, db) => {
    const { id } = request.params;

    db.select('*')
        .from('users')
        .where({ id: id })
        .then(user => {
            if (user.length > 0) {
                response.json(user[0]);
            }
            else {
                response.status(400).json('Not found');
            }
        })
        .catch(err => response.status(400).json('Error getting user with specified ID'))
}

export default handleProfileGet;