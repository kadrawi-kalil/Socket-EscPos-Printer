import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment  } from '../../environments/environment';
import {Printer,PRINTER_TYPE} from '../models/Printer';
import EscPosEncoder from 'esc-pos-encoder-ionic';
import {ReceiptDetail} from '../models/ReceiptDetail';

import * as moment from 'moment';
declare var Socket: any;
@Injectable({
  providedIn: 'root'
})
export class PrinterService {

  printers = [];

  constructor(private httpClient: HttpClient) {}

  loadPrinters(): void {
    const url = environment.SERVER_URL + '/api/printer';

    this.httpClient.get(`${url}`).subscribe((res: any) => {
      this.printers = res.data;
    });
  }

  getAllPrinters(): any {
    // return copy of the array
    return this.printers.map(element => ({ ...element }));
  }

  printQrReceipt(printer: Printer, receiptDetail: ReceiptDetail): void {
    switch (printer.printer_type) {
      case PRINTER_TYPE.WiFi:
      case PRINTER_TYPE.Network:
        const resultByte = this.generateQrReceipt(receiptDetail);
        const socket = new Socket();
        socket.open(
          printer.ip_address_of_printer,
          printer.port.toString(),
          () => {
            socket.write(
              resultByte,
              () => {
                socket.close(
                  () => {
                    console.log('connection close gracefully');
                  },
                  err => {
                    console.log('why error here');
                    console.error(err);
                  }
                );
              },
              err => {
                console.log('still error :(');
                console.error(err);
              }
            );
          },
          err => {
            console.error(err);
          }
        );

        break;
      default:
        console.error('Printer type ' + printer.printer_type + ' not found');
        break;
    }
  }

  generateQrReceipt(item: ReceiptDetail) {
    const encoder = new EscPosEncoder();
    const result = encoder.initialize();

    result.raw([0x1b, 0x74, 0x00]);
    result.size('normal');
    result.raw([0x1d, 0x21, 0x00]);

    result
      .align('center')
      .line(item.restaurant_name)
      .line('----------------------------------------------');

    result
      .align('left')
      .text('Table: ')
      .raw([0x1d, 0x21, 0x22]) // set big font
      .text(item.table_number)
      .raw([0x09, 0x09, 0x09]) // tab 3 times
      .raw([0x1d, 0x21, 0x00]) // set normal font
      .text('pax: ')
      .text(item.pax)
      .newline();

    result
      .text('Date: ')
      .text(
        moment()
          .format('YYYY/MM/DD HH:mm:ss')
          .toString()
      )
      .newline()
      .text('Order ID: ')
      .text(item.order_id)
      .newline();

    result.align('center').qrcode(item.qr_url, 1, 8);

    result
      .newline()
      .line('***************************************')
      .line('Scan the QR Code to Begin your Ordering')
      .line('***************************************');

    result
      .newline()
      .newline()
      .newline()
      .newline()
      .newline()
      .newline()
      .cut();

    return result.encode();
  }
}