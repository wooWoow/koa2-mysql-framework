import nodeSchedule from 'node-schedule';
import utils from './utils';
import homeService from '../services/homeService';

class Schedule {
  static doSome() {
    let rule = new nodeSchedule.RecurrenceRule();
    rule.second = 5;
    rule.minute = 0;
    rule.hour = 0;
  
    nodeSchedule.scheduleJob(rule, (date) => {
      utils.readFile('./scheduleAll/export/tempAndHumForHour.txt').then(res => {
        let time_str = res[0].split(' +++ ')[0].split(' ')[0];
        let humiture_val = [];
        for (let i = 0;i < 24;i++) {
          let findItem = false;
          res.forEach(item => {
            if (item) {
              let hour = item.split(' +++ ')[0].split(' ')[1].split(':')[0];
              let temperature = item.split(' +++ ')[1];
              let humidity = item.split(' +++ ')[2];
  
              if (parseInt(hour) === i) {
                findItem = true;
                humiture_val.push(temperature + ';' + humidity);
              }
            }
          });
          !findItem && humiture_val.push('0;0');
        }

        setTimeout(() => {
          homeService.saveHumiture({
            time_str,
            humiture_val: humiture_val.join(',')
          });
        }, utils.random(0, 1000));
      });
    });
  }
}

export default Schedule;
