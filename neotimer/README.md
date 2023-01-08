# propeller2_neotimer
Non blocking timer for Propeller 2 (Ported from Arduino)

  When you use a waitms() function in a Spin program, the processor stops everything it is doing until this delay is completed.
  That is called a blocking delay, because it blocks the processor until it finishes.

  Many times we don't want this to happen. This timer provides a way to use time delays without blocking the processor, so it can do other things while the timer ends up.
  This is called a non-blocking delay timer.

  The timer provides basic functionality to implement different ways of timing in a Spin program.
  You can use the timer in the following ways:

        A) Start-Stop-Restart Timer - You can start, stop and restart the timer until done.

           start()          will reset the time (counting time) and set is_started and is_waiting true.
           
           done()           will return true if the timer has reached the preset
           done_one_shot()  will return true only the first time it detects timer has reached preset
           
           stop()           will set is_started and is_waiting false.
                            It will also return the elapsed milliseconds since it was started
                            
           restart()        will set the timer to is_started and is_waiting but will not reset the time.

        B) Periodic trigger - The following example will toggle pin 56 every 500ms
        
            timer1.init(500)
            repeat
                if(timer1.repeat_execution())
                  pintoggle(56)                  

        C) Debouncer for signals - The following example shows how to debounce a signal
           coming from pin 10. Will only return true if more than 50ms have passed since
           last time it was read.
           
            pushbutton := 10
            timer1.init(50)
            repeat
                if(timer1.debounce( pinread(pushbutton) ))
                  pintoggle(56)
