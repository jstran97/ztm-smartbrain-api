const handleApiCall = (request, response) => {
    console.log('Made it into BACK-END / SERVER image.js');
    console.log(`request.body: ${request.body.input}`);
    console.log(`request.body.input Type: ${typeof(request.body.input)}`);

    const USER_ID = 'clarifai';
    const APP_ID = 'main';
    const MODEL_ID = 'face-detection';

    let raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": request.body.input
                    }
                }
            }
        ]
    });

    let requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Key ' + process.env.PERSONAL_ACCESS_TOKEN
        },
        body: raw
    };

    fetch(`https://api.clarifai.com/v2/models/${MODEL_ID}/outputs`, requestOptions)
    .then(response => response.json())
    .then(data => {
        console.log('hi', data);
        response.json(data);
    })
    .catch(err => console.log('Cannot get data from Clarifai API', err));

};

const handleImage = (request, response, db) => {
    const { id } = request.body;

    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            response.json(entries[0].entries);
        })
        .catch(err => response.status(400).json('Unable to get entries'))
}

export { handleApiCall, handleImage };