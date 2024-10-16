import { writeFile } from 'fs';
import { promisify } from 'util';
import Queue from 'bull';
import imgThumbnail from 'image-thumbnail';
import dbClient from './utils/db';
import Mailer from './utils/mailer';

const writeFileAsync = promisify(writeFile);
const fileQueue = new Queue('thumbnail generation');
const userQueue = new Queue('email sending');

const generateThumbnail = async (filePath, size) => {
  const buffer = await imgThumbnail(filePath, { width: size });
  console.log(`Generating file: ${filePath}, size: ${size}`);
  return writeFileAsync(`${filePath}_${size}`, buffer);
};

fileQueue.process(async (job, done) => {
  const { fileId, userId } = job.data;

  if (!fileId || !userId) {
    throw new Error(`Missing ${!fileId ? 'fileId' : 'userId'}`);
  }
  console.log('Processing', job.data.name || '');
  
  const file = await (await dbClient.filesCollection())
    .findOne({
      _id: new dbClient.ObjectId(fileId),
      userId: new dbClient.ObjectId(userId),
    });

  if (!file) {
    throw new Error('File not found');
  }

  const sizes = [500, 250, 100];
  await Promise.all(sizes.map((size) => generateThumbnail(file.localPath, size)));
  done();
});

userQueue.process(async (job, done) => {
  const { userId } = job.data;

  if (!userId) {
    throw new Error('Missing userId');
  }
  
  const user = await (await dbClient.usersCollection())
    .findOne({ _id: new dbClient.ObjectId(userId) });
  
  if (!user) {
    throw new Error('User not found');
  }

  console.log(`Welcome ${user.email}!`);
  
  try {
    const mailSubject = 'Welcome to ALX-Files_Manager';
    const mailContent = `
      <div>
        <h3>Hello ${user.name},</h3>
        Welcome to ALX-Files_Manager, a simple file management API. 
      </div>`;
    
    Mailer.sendMail(Mailer.buildMessage(user.email, mailSubject, mailContent));
    done();
  } catch (err) {
    done(err);
  }
});
