package com.ante.ante;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.ante.ante.Retrofit.ClientRetrofit;
import com.ante.ante.Retrofit.ServiceRetrofit;
import com.rengwuxian.materialedittext.MaterialEditText;

import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.CompositeDisposable;
import io.reactivex.functions.Consumer;
import io.reactivex.schedulers.Schedulers;
import retrofit2.Retrofit;

public class MainActivity extends AppCompatActivity {

    MaterialEditText edit_user,edit_password;
    Button btn_login;
    boolean flag = false;

    CompositeDisposable compositeDisposable = new CompositeDisposable();
    ServiceRetrofit serviceRetrofit;

    @Override
    protected void onStop(){
        compositeDisposable.clear();
        super.onStop();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        //Init Service
        Retrofit clientRetrofit = ClientRetrofit.getInstance();
        serviceRetrofit = clientRetrofit.create(ServiceRetrofit.class);

        //Init Components
        edit_user = findViewById(R.id.edit_user);
        edit_password = findViewById(R.id.edit_password);
        btn_login = findViewById(R.id.btn_login);

        btn_login.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                loginUser(edit_user.getText().toString(),edit_password.getText().toString());
                if(flag = true)
                {
                    Intent myIntent = new Intent(MainActivity.this, TrackingActivity.class);
                    myIntent.putExtra("user",edit_user.getText().toString());
                    startActivity(myIntent);
                }
            }
        });

    }
    private void loginUser(String user, String pass){
        if(TextUtils.isEmpty(user))
        {
            Toast.makeText(this,"Usuario requerido",Toast.LENGTH_SHORT).show();
            return;
        }
        if(TextUtils.isEmpty(pass))
        {
            Toast.makeText(this,"Contraseña requerida",Toast.LENGTH_SHORT).show();
            return;
        }

        compositeDisposable.add(serviceRetrofit.logUser(user,pass)
        .subscribeOn(Schedulers.io())
        .observeOn(AndroidSchedulers.mainThread())
        .subscribe(new Consumer<String>() {
            @Override
            public void accept(String s) throws Exception {
                String msg = "";
                if(""+s=="0"){msg = "El usuario no existe";}
                if(""+s=="1"){flag = true; msg ="Login correcto";}
                if(""+s=="2") {msg = "Contraseña equivocada";}
                Toast.makeText(MainActivity.this,msg,Toast.LENGTH_SHORT).show();
            }
        }));

    }
}
