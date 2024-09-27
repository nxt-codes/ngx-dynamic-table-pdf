/**
 * Utility functions for PDF handling.
 */

/**
 * Var to resolveLocalFileSystemURL
 */
declare var window: any;
/**
 * Var to cache filesystem
 */
declare var cordova: any;
/**
 * Var to startintent
 */
declare var startintent: any;

/**
 * Function to share a file.
 * @param filename 
 * @param data
 */
export function share(filename: string, data: Uint8Array): Promise<void> {
    return new Promise((resolve, reject) => {
        filename = filename.replace(/\s+|:|"/gm, '_')
        writeUint8ArrayToFile(filename, data).then((file: string) => {
            let decodedUri = decodeURIComponent(file)
            startintent.open(decodedUri, (res2: string) => {
                console.debug(res2)
                resolve()
            }, (err: any) => {
                console.error(err)
                reject(err)
            });

        }).catch((e: any) => {
            console.error(e)
            reject(e)
        })
    })
}

/**
 * Function to write a Uint8Array to a file.
 * @param filename 
 * @param uint8Array 
 * @param mimetype
 */
export function writeUint8ArrayToFile(filename: string, uint8Array: Uint8Array, mimetype?: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        (<any>window).resolveLocalFileSystemURL(
            cordova.file.cacheDirectory,
            (dirEntry: any) => {
                dirEntry.getFile(filename, { create: true, exclusive: false }, (fileEntry: any) => {
                        let path = fileEntry.nativeURL
                        fileEntry.createWriter((fileWriter: any) => {
                            fileWriter.onwriteend = (result: any) => {
                                console.log(`Datei ${filename} im Cache-Verzeichnis erstellt.`)
                                resolve(path)
                            };
                            fileWriter.onerror = (error: any) => {
                                console.error(`Fehler beim Schreiben von ${filename} im Cache-Verzeichnis: ${error}`)
                                reject(error)
                            };
                            let blob = new Blob([uint8Array])
                            fileWriter.write(blob)
                        });
                    },
                    (error: any) => {
                        console.error(`Fehler beim Erstellen der Datei ${filename}: ${error}`)
                        reject(error)
                    }
                );
            },
            (error: any) => {
                console.error(`Fehler beim Zugriff auf das Cache-Verzeichnis: ${error}`)
                reject(error)
            }
        );
    });
}

/**
 * Function to convert a base64 string to an ArrayBuffer.
 * @param base64 
 */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
    var binaryString = atob(base64)
    var bytes = new Uint8Array(binaryString.length)
    for (var i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes.buffer
}