import { Component } from '@angular/core';
import { PrinterService } from '../services/printer.service';
import { environment  } from '../../environments/environment';
import {Printer} from '../models/Printer';
import EscPosEncoder from 'esc-pos-encoder-ionic';
import {ReceiptDetail} from '../models/ReceiptDetail';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private printerService: PrinterService  ) {
   
  }
  


  test(){
    const receipt  = new ReceiptDetail();
    console.log('printerService.generateQrReceipt')
    receipt.order_id= '5gt4583';
    receipt.restaurant_name= 'Restaurant';
    receipt.table_number= '32';
    receipt.pax= '58';
    receipt.qr_url= 'http://www.example.org';

    enum PRINTER_TYPE {
      WiFi = 'WiFi printer',
      Network = 'Network port printer'
    }
    const printer =new Printer();
    printer.port='9100';
    printer.ip_address_of_printer='192.168.40.10';
    printer.printer_type='ok';
    console.log(printer)
  
    this.printerService.printQrReceipt(printer,receipt);
  }
  


}
