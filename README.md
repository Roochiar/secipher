<img src="./icon.svg" alt="secipher icon">
<h1 align="center">secipher</h1>
<a href="#فارسی" >
    <span>
        <img src="./ir.png" alt="iran icon" width="16" height="16">
    </span>
    <span>فارسی</span>
</a>
<a href="#English" >
    <span>
        <img src="./en.png" alt="iran icon" width="16" height="16">
    </span>
    <span>English</span>
</a>

## English
A library for encryption, generating multiple keys simultaneously, and managing sensitive data.

Calling the library:
```ts
    import secipher from 'secipher';
    const { key, data, file } = secipher();
    // Other code
```

### Encryption and Decryption
This library does not have a fixed encryption and generates encryption principles at the moment of request and deletes them when received.
- Note: It is your responsibility to maintain encryption principles and encrypted data!

#### Encryption
```ts
    const { codeData } = data();
    const { keys, codes } = codeData(data, keysLength, code);
    console.log(keys, codes);
```

Explanation of the codeData function:
- The first input is the data to be encrypted.
- The second input is the number of keys to be created for the encrypted data.
- The third input specifies the type of characters used for encryption.

- The first output is the keys.
- The second output is the encryption principles of data.

#### Decryption
```ts
    const { encodeData } = data();
    const res = encodeData(keys, codes);
    console.log(res);
```

Explanation of the encodeData function:
- The first input is the encrypted keys.
- The second input is the encryption principles of data.

- The output is the decrypted data.

### Keys
Creating keys in this library is very simple, and you can easily create multipart keys.
```ts
    const keys = key(keysLength, level, code);
```

Explanation of the key function:
- The first input is the number of keys it gives us.
- The second input is the length of the keys.
- The third input specifies the type of characters used for encryption.

- The output is an array containing the requested keys.

### Sensitive Data
In this library, you can easily create encrypted files for sensitive data or encryption principles.

#### Creating a File
```ts
    const request = await file.request(path);
```

Explanation of the request function:
This function creates an encrypted file along with dummy files at the specified path.

- The first input is the desired path of the encrypted file.

- The output is an object in the following format:
```ts
    {
        status: boolean,
        err: Error || res: {
            name: string,
            suffix: string,
            dir: fs.PathOrFileDescriptor,
            obj: KeyFile
        }
    }
```

#### File Interaction
```ts
    const request = await file.request(path, { name, suffix, obj });
```
By adding the second input, the function does not create a new file and searches for a file with the specified characteristics.

Explanation of the second input of the function:
- It must be an object.
- It must have three keys: name, suffix, obj.
- name: The name of the encrypted file.
- suffix: The suffix of the encrypted file.
- obj: The encryption principles of the file.

- The output is an object in the following format:
```ts
    {
        status: boolean,
        err: Error || res: {
            name: string,
            suffix: string,
            dir: fs.PathOrFileDescriptor,
            obj: KeyFile
        }
    }
```

#### Number of Dummy Files
```ts
    const request = await file.request(path, undefined, lengthFakeFiles);
```
By adding the third input, you specify the number of dummy files, which must be an integer.

#### Adding Data to a File
```ts
    const res = await file.setData(type, name, data);
```
This method is used to add new data or modify old data.

Explanation of the setData method:
- The first input specifies whether we are adding new data or modifying old data.
- The second input is the name of the data.
- The third input is the data itself.

- The output is in the following format:
```ts
    {
        status: boolean,
        res: {
            [$key]: string
        }
    }
```
- res: The new encryption principles of the file.

- Note: After each modification, the file encryption changes and you must keep it safe!

#### Finding Data from a File
```ts
    const res = await file.getData(name);
```

Explanation of the getData function:
- Its input is the name of the

- The output is in the following format:
```ts
    {
        status: boolean,
        res: data
    }
```
- res: The data you previously entered.

Suggestions or criticisms via <a href="https://t.me/Roochiarfazli">Telegram</a>.
<br/>
<br/>
<a href="./LICENSE">LICENSE</a>
<br/>
<br/>
Made in Iran.

## فارسی
یک کتابخانه برای رمزنگاری و ایجاد چندین کلید همزمان و نگهداری داده های حساس

صدا زدن کتابخانه:
```ts
    import secipher from 'secipher';
    const { key, data, file } = secipher()
    // بقیه کدها
```

### رمزنگاری و رمزگشایی
این کتابخانه رمزنگاری ثابتی ندارد و اصول رمزنگاری لحظه درخواست ساخته و لحظه دریافت در آن پاک میشود
 - نکته: مسئولیت حفظ اصول رمزنگاری و داده های رمزنگاری شده بر عهده شماست!

#### رمزنگاری
```ts
    const { codeData } = data()
    const { keys, codes } = codeData(data, keysLength, code)
    console.log(keys, codes)
```

توضیحات تابع codeData:
- اولین ورودی داده ای است که رمزنگاری میشود
- دومین ورودی تعداد کلید هایی است که برای داده رمزنگاری شده ساخته میشود
- سومین ورودی برای نوع کاراکتر هایی است که برای رمزنگاری استفاده میشود را مشخص می کند

- اولین خروجی کلیدها است
- دومین خروجی اصول رمزنگاری داده است

#### رمزگشایی
```ts
    const { encodeData } = data()
    const res = encodeData(keys, codes)
    console.log(res)
```

توضیحات تابع encodeData:
- اولین ورودی کلیدهای رمزنگاری شده است
- دومین ورودی اصول رمزنگاری داده است

- خروجی، داده رمزگشایی شده است


### کلیدها
ساختن کلید در این کتابخانه بسیار ساده است و به راحتی می توانید کلید های چند قسمتی بسازید

```ts
    const keys = key(keysLength, level, code)
```

توضیحات تابع key:
- اولین ورودی تعداد کلیدهایی است که به ما می دهد
- دومین ورودی طول کلیدها است
- سومین ورودی برای نوع کاراکتر هایی است که برای رمزنگاری استفاده میشود را مشخص می کند

- خروجی یک آرایه است که کلید های خواسته شده در آن قرار دارد


### داده های حساس
در این کتابخانه راحت می توانید فایلی رمزنگاری شده برای داده های حساس یا اصول رمزنگاری ایجاد کنید

#### ایجاد فایل
```ts
    const request = await file.request(path)
```

توضیحات تابع request:
    این تابع در مسیر مشخص شده فایل رمزنگاری شده به همراه فایل های جعلی میسازد

- اولین ورودی مسیر دلخواه فایل رمزنگاری شده است

- خروجی یک شی به صورت زیر است
    ```ts
        {
            status: boolean,
            err: Error || res: {
                name: string,
                suffix: string,
                dir: fs.PathOrFileDescriptor,
                obj: KeyFile
            }
        }
    ```

#### ارتباط با فایل
```ts
    const request = await file.request(path, { name, suffix, obj })
```
با اضافه کردن ورودی دوم، تابع دیگر فایل جدیدی نمی سازد و دنبال فایلی با مشخصات داده شده می گردد

توضیحات ورودی دوم تابع:
- حتما باید یک شی باشد
- حتما باید دارای سه کلید name, suffix, obj باشد
- name: نام فایل رمزنگاری شده است
- suffix: پسوند فایل رمزنگاری شده است
- obj: اصول فایل رمزنگاری شده است 

- خروجی یک شی به صورت زیر است
    ```ts
        {
            status: boolean,
            err: Error || res: {
                name: string,
                suffix: string,
                dir: fs.PathOrFileDescriptor,
                obj: KeyFile
            }
        }
    ```

#### تعداد دلخواه فایل های جعلی
```ts
    const request = await file.request(path, undefined, lengthFakeFiles)
```
با اضافه کردن ورودی سوم تعداد فایل های جعلی را مشخص می کنیم که حتما باید عددی صحیح باشد

#### اضافه کردن داده ها به فایل
```ts
    const res = await file.setData(type, name, data)
```
این متد برای داده جدید یا تغییر داده قدیمی استفاده می شود

توضیحات متد setData:
- اولین ورودی مشخص می کند که، داده جدیدی وارد می کنیم یا باید داده قدیمی را تغییر دهیم
- دومین ورودی نام داده می باشد
- سومین ورودی خود داده می باشد

- خروجی به صورت زیر است
    ```ts
        {
            status: boolean,
            res: {
                [$key]: string
            }
        }
    ```
    res: اصول رمزنگاری جدید فایل

- نکته: بعد از هر تغییر، رمزنگاری فایل تغییر می کند و حتما باید آن را محفوظ نگه دارید!

#### پیدا کردن داده از فایل
```ts
    const res = await file.getData(name)
```

توضیحات تابع getData:
- ورودی آن نام داده ای است که قبلا گذاشته اید

- خروجی به صورت زیر است
    ```ts
        {
            status: boolean,
            res: data
        }
    ```

انتقادات و پیشنهاد ها از طریق <a href="https://t.me/Roochiarfazli">تلگرام</a>
<br/>
<br/>
<a href="./LICENSE">LICENSE</a>
<br/>
<br/>
ساخت ایران