عملنا نظام jwt من 3 مراحل

- نقلنا generate token ل utils وبنستدعيه في الكنترولر اللى بنحتاجه

- ضيفنا 2 ايرورز خاصين بjwt في الerror handler middleware

- عملنا jwt middleware فيه بيتحقق من وجود التوكين ولو موجود بيرميه في req.user

 وفيه strict to admin بحيث يتحقق من ان اليوزر ده ادمن ونستخدمه في الروتس 
