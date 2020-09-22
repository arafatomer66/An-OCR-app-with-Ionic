import {Component} from '@angular/core';
import {createWorker} from 'tesseract.js';
import {CameraResultType, CameraSource, Plugins} from '@capacitor/core';

const {Camera} = Plugins;

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {
    selectedImage: string;
    imageText: string;
    worker: Tesseract.Worker;
    workerReady = false;
    image = 'https://tesseract.projectnaptha.com/img/eng_bw.png';
    ocrResult = '';
    captureProgress = 0;

    constructor() {
        this.loadWorker();
    }

    async loadWorker() {
        this.worker = createWorker({
            logger: progress => {
                if (progress.status === 'recognizing text') {
                    // tslint:disable-next-line:radix
                    this.captureProgress = parseInt('' + progress.progress * 100);
                }
            }
        });
        await this.worker.load();
        await this.worker.loadLanguage('eng');
        await this.worker.initialize('eng');
        this.workerReady = true;
        console.log('Fin');
    }

    async captureImage() {
        const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: true,
            resultType: CameraResultType.DataUrl,
            source: CameraSource.Camera
        });
        console.log('Image ', image);
        this.image = image.dataUrl;
    }

    async recognizeImage() {
        const result = await this.worker.recognize(this.image);
        console.log(result);
        this.ocrResult = result.data.text;
    }
}
