const express = require('express');
const cors = require('cors');

const app = express();

const data = `Building a car is a complex process that involves a wide range of engineering, design, 
and manufacturing expertise. It typically requires a team of 
skilled professionals, specialized equipment, 
and a well-organized production process. While I can 
provide a high-level overview, actually building a car requires extensive knowledge and resources beyond what can be 
covered here. \n\nHere's a simplified explanation of the general steps involved in building a car:\n\n1. Design and Engineering: 
The first step is to design the car, including the body, chassis, engine, and various components. This involves aerodynamics, structural 
integrity, safety features, and other factors. Computer-aided design (CAD) and engineering software are typically used.\n\n2. Prototyping: 
After the initial designs are completed, prototypes of the car are often built and tested to ensure that the design meets performance, safety, 
and regulatory standards.\n\n3. Manufacturing: Once the design has been finalized, the manufacturing process begins. This includes sourcing materials, 
forming the chassis and body, casting engine components, and manufacturing various subsystems like the transmission, steering system, and suspension.\n\n4. Assembly: The individual components, including the engine, transmission, steering, suspension, electrical systems, and body panels, are assembled on a production line. \n\n5. Quality Control: Throughout the manufacturing and assembly process, rigorous quality control checks are conducted to ensure that each component meets the required standards.\n\n6. Testing: After assembly, the car undergoes extensive testing, including performance testing, safety testing, and regulatory compliance testing.\n\n7. Distribution: Once the cars have passed all tests, they are prepared for distribution to dealerships or customers.\n\nBuilding a car involves a highly technical and methodical process that requires expertise in engineering, materials science, manufacturing, and quality control. It also involves compliance with various safety, environmental, and regulatory standards. Therefore, building a car is a highly specialized and sophisticated endeavor that is typically carried out by professional automotive manufacturers.`;

const data2 =
  'I love supporting **[EFF](https://eff.org)**. This is the <hello> *[Markdown Guide](https://www.markdownguide.org)*.';

const data3 = `<p>Good Morning Sophie,</p><br><p>Thank you for your email.</p><br><p>We have noted your request for a room with twin beds for Sheila Mason and Joan Kemp, who are due to stay with us from the 1st of July for 4 nights. While we will do our best to accommodate this request, please be aware that we cannot guarantee it.</p><br><p>If you have any questions, please don't hesitate to contact us.  </p><br><p>If you have time, if you could choose one of the five options below to rate how your query was handled.</p><br><p>Kind Regards,  </p><br><p>Rebeca Solana</p><br><p>Reservation Sales Agents</p>`;

const dataChunks = data.split(' ');

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  let messageCount = 0;

  const interval = setInterval(() => {
    messageCount++;

    const chunk = {
      initial: messageCount === 1,
      text: dataChunks[messageCount - 1],
      final: messageCount === dataChunks.length,
      messageId: 789,
    };

    const event = {
      name: 'message',
      data: JSON.stringify(chunk),
    };

    const eventString = `event: ${event.name}\ndata: ${event.data}\n\n`;

    res.write(eventString);

    if (messageCount === dataChunks.length) {
      res.end();
      clearInterval(interval);
    }
  }, 50);

  req.on('close', () => {
    clearInterval(interval);
  });
});

// app.post('/post-sse', (req, res) => {
//   res.setHeader('Content-Type', 'text/event-stream');
//   res.setHeader('Cache-Control', 'no-cache');
//   res.setHeader('Connection', 'keep-alive');

//   let messageCount = 0;

//   const interval = setInterval(() => {
//     messageCount++;

//     const chunk = {
//       initial: messageCount === 1,
//       text: dataChunks[messageCount - 1],
//       final: messageCount === dataChunks.length,
//       messageId: 789,
//     };

//     const event = {
//       name: 'message',
//       data: JSON.stringify(chunk),
//     };

//     const eventString = `event: ${event.name}\ndata: ${event.data}\n\n`;

//     res.write(eventString);

//     if (messageCount === dataChunks.length) {
//       res.end();
//       clearInterval(interval);
//     }
//   }, 50);

//   req.on('close', () => {
//     clearInterval(interval);
//   });
// });

app.listen(5001, () => {
  console.log('Server is running on port 5001');
});
