const express = require('express');
const cors = require('cors');
const axios = require('axios');
const morgan = require('morgan');
const { json, urlencoded } = express;

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan('tiny'));

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'CommentCreated') {
    const status = data.content.includes('orange') ? 'rejected' : 'approved';

    try {
      await axios.post('http://event-bus-srv:4005/events', {
        type: 'CommentModerated',
        data: {
          status,
          id: data.id,
          postId: data.postId,
          content: data.content,
        },
      });
    } catch (error) {
      console.log(error);
      res.statys(500).json({ status: 'FAIL' });
    }
  }

  res.sendStatus(200);
});

app.listen(4003, () => {
  console.log('Listening on port 4003');
});
