import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { CarouselComponent } from 'ngx-bootstrap/carousel';
import { newQuestionFormatMcq } from './data';


@Component({
  selector: 'quml-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  @Input() questions: any;
  @Output() componentLoaded = new EventEmitter<any>();
  @Output() previousClicked = new EventEmitter<any>();
  @Output() nextClicked = new EventEmitter<any>();
  @Output() questionClicked = new EventEmitter<any>();
  @ViewChild('car') car: CarouselComponent;

  endPageReached: boolean;
  slides: any;
  slideInterval: number;
  showIndicator: Boolean;
  noWrapSlides: Boolean;
  optionSelectedObj: any;
  showAlert: Boolean;
  skippedQuestion = 0;
  answeredQuestionCorrectly = 0;
  scoreSummary = {};
  questionData = this.getQuestionData();
  linearNavigation = true; // this allows user to navigate in forward direction only
  timer = true;
  timing = 10000;
  CarouselConfig = {
    NEXT: 1,
    PREV: 2
  };

  constructor() {
    this.endPageReached = false;
    this.navigatesToEndPageWithTimer();
  }
  getQuestionData() {
    // return questionSet.stage[0]['org.ekstep.questionset'][0]['org.ekstep.question'];
    return newQuestionFormatMcq.result;
  }

  ngOnInit() {
    this.slideInterval = 0;
    this.showIndicator = false;
    this.noWrapSlides = true;
    this.questions = this.questions ? this.questions : this.questionData;
    // this.setQuestionType();
    // console.log('after set question type', this.questions);
  }

  setQuestionType() {
    this.questionClicked.forEach((ele) => {
      ele.questionType = 'mcq';
    });
    // this.questions.forEach(element => {
    //   if (typeof (element.config.__cdata) === 'string') {
    //     const config = JSON.parse(element.config.__cdata);
    //     element.questionType = config.metadata.type;
    //   } else {
    //     element.questionType = element.config.metadata.type;
    //   }
    // });
  }

  navigatesToEndPageWithTimer() {
    if (this.timer) {
      setTimeout(() => {
        this.endPageReached = true;
      }, this.timing);
    }
  }

  nextSlide() {
    if (this.car.getCurrentSlideIndex() + 1 === this.questions.length) {
      this.endPageReached = true;
      this.getScoreSummary();
      return;
    }
    if (this.optionSelectedObj === undefined || Object.keys(this.optionSelectedObj).length === 0) {
      this.car.move(this.CarouselConfig.NEXT);
      this.optionSelectedObj = {};
      this.skippedQuestion = this.skippedQuestion + 1;
      this.scoreSummary['skippedQuestion'] = this.skippedQuestion;
    } else if (this.optionSelectedObj.result) {
      this.car.move(this.CarouselConfig.NEXT);
      this.answeredQuestionCorrectly = this.answeredQuestionCorrectly + 1;
      this.scoreSummary['answeredQuestionCorrectly'] = this.answeredQuestionCorrectly;
    } else if (this.optionSelectedObj.result === false) {
      this.showAlert = true;
    }
  }

  getScoreSummary() {
    return this.scoreSummary = {
      answeredQuestionCorrectly: this.answeredQuestionCorrectly,
      skippedQuestion: this.skippedQuestion,
      totalNoOfQuestions: this.questions.length
    };
  }

  skip() {
    this.car.move(this.CarouselConfig.NEXT);
    this.showAlert = false;
    this.optionSelectedObj = {};
  }


  getOptionSelected(optionSelected) {
    this.optionSelectedObj = optionSelected;
  }

  prevSlide() {
    if (this.car.getCurrentSlideIndex() + 1 === this.questions.length && this.endPageReached) {
      this.endPageReached = false;
    } else if (!this.linearNavigation) {
      this.car.move(this.CarouselConfig.PREV);
    }
  }

  addSlide() {
    this.slides.push(this.questions.length);
  }

  removeSlide() {
    this.slides.length = this.slides.length - 1;
  }

  nextSlideClicked(event) {
    if (event = 'next clicked') {
      this.nextSlide();
    }
  }

  previousSlideClicked(event) {
    if (event = 'previous clicked') {
      this.prevSlide();
    }
  }
  replayContent() {
    this.endPageReached = false;
    this.car.selectSlide(0);
  }

}
