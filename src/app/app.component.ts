import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Token } from 'src/app/manager/token';
import { AgentService } from 'src/app/service/agent.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { AnalyticsService } from './analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
    console.log('beforeUnloadHander event : ', event);
    localStorage.tabCount = localStorage.tabCount - 1;
    this.analyticsService.logEvent('Browser Closed').subscribe((response) => {
      console.log('logEvent : ', response);
    }, (error) => {
      console.log('logEvent : ', error);
    });
    // alert('before unload');
    // return false
    /// remove above comment to show popup to user on page refresh or close
  }

  ngOnInit(): void {

    this.Getcount();
  }
  ResponseHelper: ResponseHelper;
  breakStatus;
  title = 'GeBBS : iAR';
  MenuName: string;
  DisplayMenu;
  ShowElement: boolean = false;
  FirstLogin;
  Token: Token;
  resumeBreak;
  constructor(private router: Router,
    private ts: Title,
    private agentService: AgentService,
    private analyticsService: AnalyticsService,
    private notificationservice: NotificationService,
  ) {
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
    this.breakAction();
  }
  breakAction() {
    this.breakStatus = sessionStorage.getItem('BreakStatus');
    this.resumeBreak = sessionStorage.getItem('resumeBreak');
    if (this.breakStatus == "true" && this.resumeBreak != null) {
      let data = JSON.parse(this.resumeBreak)
      this.agentService.endBreak(data).subscribe(res => {
        this.ResponseHelper.GetSuccessResponse(res);
        sessionStorage.setItem('BreakStatus', "false");
        sessionStorage.setItem('resumeBreak', null);
      }, err => {
        this.ResponseHelper.GetFaliureResponse(err);
        sessionStorage.setItem('BreakStatus', "true");
      });
    }
  }


  Getcount() {
    localStorage.tabCount = +localStorage.tabCount + 1;

    window.onunload = function () {
      localStorage.tabCount = +localStorage.tabCount - 1;
    };

    if (localStorage.tabCount > 0) {
      this.router.navigate(['/multiple-tab']);
    }
    else {
      localStorage.tabCount = 0;
    }
  }

  ChangeRouteName(event) {
    this.ShowElement = true;
    if (event.router != undefined) {

      this.MenuName = event.router.url;

      switch (event.router.url) {
        case '/login':
          this.ShowElement = false;
          break;
        case '/two-factor-auth':
          this.ShowElement = false;
          break;
        case '/forgot-password':
          this.ShowElement = false;
          break;
        case '/change-password':
          try {
            this.Token = new Token(this.router);
            this.FirstLogin = this.Token.GetUserData().FirstLogin;
            if (this.FirstLogin == false) {
              this.ShowElement = true;
            } else {
              this.ShowElement = false;
            }
            break;
          } catch (Exception) {
            let data = [{ Message: "Please Login First.", Type: "ERROR" }]
            this.notificationservice.ChangeNotification(data)
            this.router.navigateByUrl[('/login')]
          }
      }
      let menuname: string = event.router.url;
      menuname = menuname.split("-").join(" ").substring(1);
      menuname = menuname.replace(/(\w)(\w*)/g,
        function (g0, g1, g2) { return g1.toUpperCase() + g2.toLowerCase(); });
      this.ts.setTitle(menuname + " | " + this.title);
    }
    else {
      this.ShowElement = false;
    }
  }

  ToggleMenu(event) {
    this.DisplayMenu = event;
  }

  ToggleMenuFromFooter(event) {
    this.DisplayMenu = event;
  }

  getCLientList() {
    fetch('http://172.30.52.25:1001/api/Mapping_CRUD_', {
      method: 'get',
      headers: new Headers({
        'Access_Token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJVc2VyX0lkIjozNDU5LCJFbXBsb3llZV9Db2RlIjoiMzU3MDEiLCJGdWxsX05hbWUiOiJwb29qYSBtYWhpbmRyYWthciIsIlJvbGVfTmFtZSI6IkNvbnRyb2xsZXIiLCJMb2dpbl9EYXRlVGltZSI6IjIwMjAtMDItMTlUMTI6MjI6MDguNTIwMTcwMiswNTozMCIsIkNsaWVudHMiOlt7IkNsaWVudF9JZCI6MTMsIkNsaWVudF9OYW1lIjoiVGVzdF85NSJ9LHsiQ2xpZW50X0lkIjo2LCJDbGllbnRfTmFtZSI6IkNSTlJfQk5CIn0seyJDbGllbnRfSWQiOjcsIkNsaWVudF9OYW1lIjoiQ1JOUl9DUlpSIn0seyJDbGllbnRfSWQiOjgsIkNsaWVudF9OYW1lIjoiR0hTSSJ9LHsiQ2xpZW50X0lkIjo5LCJDbGllbnRfTmFtZSI6IkdIU0lfRGVtbyJ9LHsiQ2xpZW50X0lkIjoxMCwiQ2xpZW50X05hbWUiOiJDUk5SX0JOQl9KVU5FIn0seyJDbGllbnRfSWQiOjExLCJDbGllbnRfTmFtZSI6IkNSTlJfQ1JaUl9KVU5FIn0seyJDbGllbnRfSWQiOjEyLCJDbGllbnRfTmFtZSI6IlRlc3RfOTIifSx7IkNsaWVudF9JZCI6MTQsIkNsaWVudF9OYW1lIjoiQ1JOUl9BTV9KVUxZIn0seyJDbGllbnRfSWQiOjE5LCJDbGllbnRfTmFtZSI6ImNsaWVudF8xIn0seyJDbGllbnRfSWQiOjIwLCJDbGllbnRfTmFtZSI6ImNsaWVudF8yIn0seyJDbGllbnRfSWQiOjIxLCJDbGllbnRfTmFtZSI6ImNsaWVudF8zIn0seyJDbGllbnRfSWQiOjIyLCJDbGllbnRfTmFtZSI6ImNsaWVudF80In0seyJDbGllbnRfSWQiOjIzLCJDbGllbnRfTmFtZSI6ImNsaWVudF81In0seyJDbGllbnRfSWQiOjI0LCJDbGllbnRfTmFtZSI6IkNSTlJfU1RKT19PQ1QifSx7IkNsaWVudF9JZCI6MjUsIkNsaWVudF9OYW1lIjoiY2xpZW50XzYifSx7IkNsaWVudF9JZCI6MjYsIkNsaWVudF9OYW1lIjoiUlBUX0FSX09DVCJ9LHsiQ2xpZW50X0lkIjoyNywiQ2xpZW50X05hbWUiOiJDUk5SX1BBTkEifSx7IkNsaWVudF9JZCI6MjgsIkNsaWVudF9OYW1lIjoiQVBJIn0seyJDbGllbnRfSWQiOjI5LCJDbGllbnRfTmFtZSI6Ik5UTUNfSG9zcGl0YWxfTk9WIn0seyJDbGllbnRfSWQiOjEwMjgsIkNsaWVudF9OYW1lIjoiY2xpZW50XzEwIn0seyJDbGllbnRfSWQiOjEwMjksIkNsaWVudF9OYW1lIjoiY2xpZW50XzExIn0seyJDbGllbnRfSWQiOjE1LCJDbGllbnRfTmFtZSI6IlRlc3RfQUsifSx7IkNsaWVudF9JZCI6MTYsIkNsaWVudF9OYW1lIjoidGVzdDg5In0seyJDbGllbnRfSWQiOjE3LCJDbGllbnRfTmFtZSI6InRlc3Q2NyJ9LHsiQ2xpZW50X0lkIjoxOCwiQ2xpZW50X05hbWUiOiJuZXcifV0sIklzX0ZpcnN0X0xvZ2luIjpmYWxzZSwiRW1haWxfSWQiOiJwb29qYS5tYWhpbmRyYWthckBnZWJicy5jb20ifQ.VbYRLZLn5hElMwif7fAQnbzeHMBPklVrdRQFDNEhjP',
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
    }).then((response) => {
      console.log('response : ', response)
    }).catch((error) => {
      console.log('error : ', error);
    });
  }

}


