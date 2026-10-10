import string
def check_password(password):
  score=0
  if len(password)>=8:
     score+=1
  if any(char.isupper() for char in password):
     score+=1
  if any(char.islower() for char in password):
     score+=1
  if any(char.isdigit() for char in password):
     score+=1
  if any(char in string.punctuation for char in password):
     score+=1
  if score<=2:
    return "Weak"
  elif score<=4:
     return "Medium"
  else:
  
    return "Strong"
password=input("Enter a sample password:")
strength=check_password(password)
print("password strength:",strength)
