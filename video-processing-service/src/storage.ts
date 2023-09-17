// 1. GCS file interactions

import { Storage } from '@google-cloud/Storage';
import fs from 'fs'
import ffmpeg from 'fluent-ffmpeg';

// 2. Local file interactions
// Create the local directories for raw and processed videos.

const storage = new Storage();

const rawVideoBucketName = "Thong-yt-raw-videos";
const processedVideoBucketName = "Thong-yt-processed-videos";

const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";

/**
 * Creates the local directories for raw and processed videos.
 */

export function setupDirectories() {
    ensureDirectoryExistence(localRawVideoPath);
    ensureDirectoryExistence(localProcessedVideoPath);
}

/**
 * @param rawVideoName - the name of the file to convert from {@link localRawVideoPath}.
 * @param processedVideoName - the name of the file to convert from {@link localProcessedVideoPath}.
 * @returns A promise that resolves when the video has been converted.
 */

export function convertVideo(rawVideoName: string, processedVideoName: string) {
    // Create the ffmpeg command
    return new Promise<void>((resolve, reject) => {
        ffmpeg(`{localRawVideoPath}/${rawVideoName}`)
        .outputOptions('-vf', 'scale=-1:360') // 360p
        .on('end', function() {
            console.log('Processing finished successfully');
            resolve();
        })
        .on('error', function(err: any) {
            console.log('An error occurred: ' + err.message);
            reject(err);
        })
        .save(`{localProcessedVideoPath}/${processedVideoName}`);
    })
}

/**
 * @param fileName - the name of the file to download from the
 * @param rawVideoBucketName bucket into the {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been converted.
 */

export async function downloadRawVideo(fileName: string) {
    await storage.bucket(rawVideoBucketName)
        .file(fileName)
        .download({ destination: `${localRawVideoPath}/${fileName}`});
    
    console.log(
        `gs://${rawVideoBucketName}/${fileName} download to ${localRawVideoPath}/${fileName}.`
    );

}

/**
 * @param fileName - the name of the file to upload from the
 * @param localProcessedVideoPath folder into the  {@link processedVideoBucketName} bucket.
 * @returns A promise that resolves when the file has been converted.
 */

export async function uploadProcessedVideo(fileName: string) {
    const bucket = storage.bucket(processedVideoBucketName);

    await bucket.upload(`${localProcessedVideoPath}/${fileName}`, {
        destination: fileName
    })
    console.log(
        `${localProcessedVideoPath}/${fileName} uploaded to gs://${processedVideoBucketName}/${fileName}.`
    )

    await bucket.file(fileName).makePublic();
}

/**
 * @param filePath - the path of the file to delete.
 * @returns A promise the resolves when the file has been deleted.
 */

function deleteFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) =>{
        if (fs.existsSync(filePath)){
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(`Failed to delete file at ${filePath}`, err);
                    reject(err);
                }
                else{
                    console.log(`File deleted at ${filePath}`);
                    resolve();
                }
            })
        }
        else {
            console.log(`File not found at ${filePath}, skipping the delete.`)
            resolve();
        }
    });
}

/**
 * @param fileName - The name of the file to delete form the
 * {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been deleted.
 */

export function deleteRawVideo(fileName: string) {
    return deleteFile(`${localRawVideoPath}/${fileName}`);
}

/**
 * @param fileName - The name of the file to delete form the
 * {@link localProcessedVideoPath} folder.
 * @returns A promise that resolves when the file has been deleted.
 */

export function deleteProcessedVideo(fileName: string) {
    return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}

/**
 * Ensure a directory exists, creating it if necessary.
 * @param {string} dirPath - the directory path to check.
 */

function ensureDirectoryExistence(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, {recursive:true});
        console.log(`Directory created at ${dirPath}`);
    }
}