# Front-End Developer Task -  Astronomy Photo Of the Day based birthday calendar

**A simple, Javascript based task checking your frontend development skills.** 



### Requirements/perequisites:
* Do not use any framework (VueJS, React etc.)
* Do note use Bootstrap
* No jQuery please
* Layout should be responsive, working both on desktop/ipad/phones.



### Preparation
Sign-up for free *NASA API* key https://api.nasa.gov/index.html#apply-for-an-api-key
to use the *APOD API* - https://api.nasa.gov/api.html#apod for this project.



### Task description
1. Design, create and style a web-form that allows user to:

* create

* update

* delete 

a person's brithday. 
Fields to be included in the form are: name, photo, birth date, e-mail, phone.
Form input should be validated on all fields (data format), all fields are to be mandatory.

2. After the form has been submitted, display a whole page, responsive calendar  (single month view).
The calendar should indicate a person's birthday on a given day (name, age, email, thumbnail of the photo pulled from the api).
Keep in mind that since there are no Photo of the Day being returned for dates in the future, the YEAR value in the date sent to the APOD API needs to be decreased by 1).
The full month calendar view should allow to navigate months back/forward. 

3. Day containing birthday should be clickable, once clicked - should display a full screen (modal window) photo together with title and description retreived from the API. User should be able to close the modal/fulls creen view.

4. Below the calendar display a list of birthdays in the current year (date, photo, name, email). The list should allow to edit and remove entries.


**Once completed, submit to your github account and provide us with link.**

## Have fun!
